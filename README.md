# 100GPTGames

**100GPTGames** is an experimental project that explores how large language models like OpenAI’s GPT can enhance and reimagine traditional game mechanics, storytelling, and interactivity. The goal is to create 100 playable AI demos within three years. Everyone is welcome to join or contribute to the project!

## 🌟 Level 1 - Catch the bat (10%)

### Challenges

- Latency in API calls when using AI models that can impact real-time responsiveness in gameplay.
- Context awareness: One major challenge is helping the AI understand in-game factors. 
For example, I want to create an AI-driven NPC to complete a specific task. However, since the NPC lacks any visual perception, it's challenges to pass all game states—like other NPC's behaviors or the structure of the map to the NPC.

## About Catch the bat

In this case, using AI is like doing something for the sake of doing it — totally unnecessary. But the main purpose of the first game is to explore how to integrate the LLM mode into the game.

- **Game engine**: RPG maker MV. RPG Maker is built by using JavaScript, which makes it easier to interact with LLM APIs.
- **LLM API**: Azure OpenAI.
- **How to play**: Catch the bat from behind.
- **AI function**: Create a plugin to call the Azure OpenAI service, then use it to control the game workflow and determine whether the player is behind the bat.

<img src="./level1/media/game1-plugin.png" width="900">





