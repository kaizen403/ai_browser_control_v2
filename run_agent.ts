import { CtrlAgent } from "./src";
import * as dotenv from "dotenv";
import * as readline from "readline";

dotenv.config();

async function main() {
    const agent = new CtrlAgent({
        llm: {
            provider: "openai",
            model: "gpt-4o",
        },
        localConfig: {
            headless: false,
        }
    });

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log("🤖 Browser Agent Ready!");
    console.log("Enter your command (or 'exit' to quit):");

    const askQuestion = () => {
        rl.question('> ', async (task) => {
            if (task.toLowerCase() === 'exit') {
                console.log("Goodbye!");
                await agent.closeAgent();
                rl.close();
                return;
            }

            try {
                console.log(`Executing: "${task}"...`);
                await agent.executeTask(task);
                console.log("✅ Task completed!");
            } catch (error) {
                console.error("❌ Error:", error);
            }

            askQuestion();
        });
    };

    askQuestion();
}

main().catch(console.error);
