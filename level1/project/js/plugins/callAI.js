/*:
 * @plugindesc Connects to Azure OpenAI and controls character movement via GPT. 📡🤖🧭
 * @author YourName
 *
 * @param ApiKey
 * @text API Key
 * @desc Your Azure OpenAI API Key
 * @default
 *
 * @param Endpoint
 * @text Endpoint
 * @desc Your Azure endpoint (e.g., https://your-resource.openai.azure.com)
 * @default
 *
 * @param DeploymentName
 * @text Deployment Name
 * @desc Name of your Azure OpenAI deployment
 * @default gpt-35-turbo
 *
 * @param ApiVersion
 * @text API Version
 * @desc API version to use (default: 2024-02-15-preview)
 * @default 2024-02-15-preview
 *
 * @help
 * Plugin Command:
 *   AzureGPT call "your message here"
 * 
 * Interprets GPT response to move player to coordinates if detected.
 */

(() => {
  const parameters = PluginManager.parameters('callAI');
  const apiKey = parameters['ApiKey'] || '';
  const endpoint = parameters['Endpoint'] || '';
  const deploymentName = parameters['DeploymentName'] || 'gpt-35-turbo';
  const apiVersion = parameters['ApiVersion'] || '2024-02-15-preview';

  const variableId = 1; // Stores GPT text response
  const variableStatus = 2; // Status flag (optional use)

  const TargetEventId = 1;
  
  // Orchestrator: Interpret GPT response and act
  const orchestrateNextAction = (gptResponse) => {
    let parsed;
    try {
        parsed = JSON.parse(gptResponse);
    } catch (e) {
        console.warn('[Orchestrator] GPT response is not valid JSON:', gptResponse);
        return;
    }

    const intent = parsed.intent;
    const position = parsed.position || [12,17];
    const message = parsed.message || 'Hello world';

    switch (intent) {
        case 'move':
            const commandStr = ` move to: 12, 17}`;
            console.log(`[Orchestrator] Moving player to (${position[0]}, ${position[1]})`);
            console.log(`[Orchestrator] Moving player to (${position[0]}, ${position[1]}) using moveToPoint`);
            
            var list = [];
            var char = $gamePlayer;
            var cOpa = Game_Character.ROUTE_CHANGE_OPACITY;
            
            // Move 3 steps down (you can change to another direction if needed)
 
              list.push({
              code: Game_Character.ROUTE_SCRIPT,
              parameters: [`move to: ${position[0]}, ${position[1]}`]
            });
            
            

            list.push({ code: Game_Character.ROUTE_END });
            
            var route = { list: list, repeat: false, skippable: false };
            $gameMessage.add("I can see you. Go away!");
            char.forceMoveRoute(route);
            //$gamePlayer.setWaitMode('route');
           
            break;

        case 'bubble':
            console.log(`[Orchestrator] Showing bubble message: ${message}`);
            $gameMap.event(TargetEventId).requestAnimation(1);
            $gameMessage.add("I catch you!");
            break;

        case 'speak':
            console.log(`[Orchestrator] Showing dialogue: ${message}`);
            $gameMessage.add("I see you");
            break;

        default:
            console.warn(`[Orchestrator] Unknown intent: ${intent}`);
    }
};

  const callAzureGPT = async (userMessage) => {
    console.log(userMessage)
        var player = $gamePlayer;
      const url = `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;
      const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
      };

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
    Treasure position：18，12
    door position：5，11
    
    
    `
            },
            {
                role: 'user',
                content: userMessage
            }
        ],
        temperature: 0.5
    };
    console.log(body.messages[0].content);
      try {
          const response = await fetch(url, {
              method: 'POST',
              headers,
              body: JSON.stringify(body)
          });

          const data = await response.json();
          const content = data.choices[0].message.content || 'No response.';
          console.log('GPT response:', content);

          $gameVariables.setValue(variableStatus, 2);
          $gameVariables.setValue(variableId, content);

          // Orchestrate based on GPT output
          orchestrateNextAction(content);
      } catch (error) {
          console.error('Azure GPT Error:', error);
          $gameVariables.setValue(variableId, 'Error contacting GPT.');
      }
  };

  const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
      _Game_Interpreter_pluginCommand.call(this, command, args);
      if (command === 'AzureGPT') {
          const userMessage = args.join(' ');
          callAzureGPT(userMessage);
      }
  };
})();
