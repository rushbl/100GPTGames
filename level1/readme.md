# Catch the Bat

## Version
**0.1** , updated on 05/28/2025

## How to Use This Project

1. Create a new project in **RPG Maker MV**. Note that the project also contains Yanfly's [Move_Route_Core](http://www.yanfly.moe/wiki/Move_Route_Core_(YEP) ). Feel free to contact me if there is any concern or problem. 
2. Download this project and **copy all folders/files**, replacing the originals in your RPG Maker project directory.
3. Add the plugin `callAI.js` from the `/js/plugins` folder into your game using the **Plugin Manager**.
4. Configure your Azure OpenAI credentials:
   - Set your **API key**
   - Provide the **full endpoint URL**, such as:

     ```
     https://myservice.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2025-01-01-preview
     ```

     <img src="./media/game1-plugin.png" width="900">

5. The plugin is utilized within **Event 1 (the bat)** to determine AI-driven behavior based on player interaction.

---

## How the AI Mode Works In-Game

## Step 1 AI role definition and call API

The AI is used to interpret natural language input and determine game behavior by returning structured JSON commands.

### AI Output Format

```json
{
  "intent": "move | bubble | speak",
  "position": [x, y], // Required if intent is "move"
  "message": "Text to display" // Required if intent is "bubble" or "speak"
}
```

### AI role definition

```
 const body = {
        messages: [
            {
                role: 'system',
                content: `
    You are an RPG game assistant. Based on the user's input, determine the next action and convert it to the following JSON format:
    {
      "intent": "move | bubble | speak",
      "position": [x, y], // // Required if the intent is "move"
      "message": "Text to display" //// Required if the intent is "bubble" or "speak"
    }
    Do not include any extra explanations, fields, or code block prefixes, only return the JSON.
    ## Game data
    direction means： 2 (down), 4 (left), 6 (right), or 8 (up).
    NPC direction：${$gameMap.event(TargetEventId).direction()}
    NPC position:${$gameMap.event(TargetEventId).x},${$gameMap.event(TargetEventId).y}
    player direction：${$gamePlayer.direction()}
    player position：${$gamePlayer.x},${$gamePlayer.y}
            },
```
### Step 2 Orchestrator Logic

Once the AI returns its JSON response, an orchestrator-like function parses the result and triggers the appropriate in-game actions such as moving the player, displaying speech bubbles, or executing dialogue.

```
switch (intent) {
        case 'move':
            ....
        case 'bubble':
            console.log(`[Orchestrator] Showing bubble message: ${message}`);
            $gameMap.event(TargetEventId).requestAnimation(1);
            $gameMessage.add("I catch you!");
            break;

      case 'speak':
            console.log(`[Orchestrator] Showing dialogue: ${message}`);
            $gameMessage.add("I see you");
            break;

```
