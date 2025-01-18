import express from "express";
import { OpenAI } from "openai";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
import cheerio from 'cheerio-without-node-native';

dotenv.config();
const app = express();
const PORT= 7300;
const allowedOrigins = [
    "http://localhost:8081",  // for Metro bundler
    "http://192.168.1.245:8081" // my device/emulator IP
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }
}));

const api_key=process.env.OPENAI_API_KEY;

// Music API setup
const musicApiUrl = "https://api.musicapi.ai/api/v1/sonic";
const musicApiToken = process.env.MUSIC_API_BEARER_TOKEN;

const geniusSearchApi = process.env.GENIUS_SEARCH_API;
const geniusApiToken = process.env.GENIUS_API_TOKEN;

const client = new OpenAI({
    baseURL: "https://api-inference.huggingface.co/v1/",
    apiKey: api_key,
});

// for parsing application/json...
app.use(express.json());


// genius api lyrics web-scrapping...
const getLyrics = async (url) => {
	try {
        const { data } = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        });
        const $ = cheerio.load(data);

        // Scrape lyrics from the latest structure
        let lyrics = $('div[data-lyrics-container]').text().trim();

        // Fallback if lyrics are not found in the primary selector
        if (!lyrics) {
            lyrics = $('div[class^="Lyrics__Container"]').map((i, el) => {
                return $(el).text().trim();
            }).get().join('\n\n');
        }

        return lyrics || null;
    } catch (error) {
        console.error(`Error fetching lyrics: ${error.message}`);
        return null;
    }
};

// endpoint to create ai song...
app.post("/api/create-song", async (req, res) => {
    const { genre, story, lyrics } = req.body;

    if (story && genre && !lyrics) {
        try {
            console.log('Received request to create song with genre:', genre, 'and story:', story);

            const chatCompletion = await client.chat.completions.create({
                model: "Qwen/Qwen2.5-Coder-32B-Instruct",
                messages: [
                    { role: "system", content: "You are a music writer and your task is to write lyrics of music exactly 22 lines." },
                    {
                        role: "user",
                        content: `Write lyrics based on ${genre} with the following story: ${story}`
                    }
                ],
                max_tokens: 500
            });

            const generatedLyrics = chatCompletion.choices?.[0]?.message?.content;
            if (!generatedLyrics) {
                throw new Error("Failed to generate lyrics.");
            }
            console.log("Generated Lyrics:", generatedLyrics);

            const musicResponse = await axios.post(
                `${musicApiUrl}/create`,
                {
                    custom_mode: true,
                    prompt: generatedLyrics,
                    title: "Generated Song",
                    tags: genre,
                    make_instrumental: false,
                    mv: "sonic-v3-5"
                },
                {
                    headers: {
                        Authorization: `Bearer ${musicApiToken}`
                    },
                }
            );

            const taskId = musicResponse.data.task_id;
            if (!taskId) {
                throw new Error("Task ID is missing in the response from Music API.");
            }

            res.json({ taskId });

        } catch (error) {
            console.error("Error generating song:", error?.response?.data || error.message);
            res.status(500).json({ error: "Failed to generate song. Please try again later." });
        }
    }
    else if (lyrics && !story && !genre) {
        try {
            console.log('Received request to create song using provided lyrics.');

            const musicResponse = await axios.post(
                `${musicApiUrl}/create`,
                {
                    custom_mode: true,
                    prompt: lyrics,
                    title: "Generated Song",
                    tags: "generated",
                    make_instrumental: false,
                    mv: "sonic-v3-5"
                },
                {
                    headers: {
                        Authorization: `Bearer ${musicApiToken}`
                    },
                }
            );

            const taskId = musicResponse.data.task_id;
            if (!taskId) {
                throw new Error("Task ID is missing in the response from Music API.");
            }

            res.json({ taskId });

        } catch (error) {
            console.error("Error generating song using provided lyrics:", error?.response?.data || error.message);
            res.status(500).json({ error: "Failed to generate song. Please try again later." });
        }
    } else {
        return res.status(400).json({ error: "Invalid request. Provide either story and genre or lyrics." });
    }
});


// Get endpoint to fetch song by taskID...
app.get("/api/song/:taskid", async (req, res) => {
    const taskId = req.params.taskid;

    try {
        console.log(`Fetching song with task ID: ${taskId}`);

        const songResponse = await axios.get(
            `${musicApiUrl}/task/${taskId}`,
            {
                headers: {
                    Authorization: `Bearer ${musicApiToken}`,
                },
            }
        );

        const songs = songResponse.data.data;

        if (!songs || songs.length === 0) {
            return res.status(404).json({ message: "Song not found." });
        }

        const song = songs[0];
        const { state, audio_url, image_url, lyrics } = song;

        if (state === 'running') {
            return res.status(202).json({
                message: "The song is still being processed. Please check back later.",
                status: state,
            });
        }

        if (state === 'succeeded' && audio_url && image_url && lyrics) {
            return res.status(200).json({ audioUrl: audio_url, imageUrl: image_url, lyrics: lyrics });
        }

        return res.status(404).json({ message: "Song not found or audio is not available." });
    } catch (error) {
        console.error("Error fetching song:", error?.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch song. Please try again later." });
    }
});


// Genius api for search song...
app.get('/api/search-song', async (req, res) => {
    const searchQuery = req.query.q;

    try {
        const response = await axios.get(`${geniusSearchApi}${searchQuery}`, {
            headers: {
                Authorization: `Bearer ${geniusApiToken}`
            }
        });

        const data = response.data.response.hits;   

        // fetch lyrics...
        const fetchLyrics = await Promise.all(
            data.map(async (item) => {
                const songUrl = item.result.url;

                try {
                    const lyrics = await getLyrics(songUrl);
                    console.log(lyrics);

                    return{
                        ...item.result,
                        lyrics,
                    }
                } catch (error) {
                    console.log(`Error fetching lyrics for ${songUrl}`, error);

                    return{
                        ...item.result,
                        lyrics: null,
                    }
                }
            })
        )

        res.status(200).json({ data: fetchLyrics });
    } catch (error) {
        console.log("Error fetching from Genius API", error);
        res.status(500).json({ message: 'Error fetching songs' });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});