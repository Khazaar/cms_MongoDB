import { ITaskDynamic } from "./../models/taskDynamic.model";
import { ITeam } from "./../models/team.model";
import { Context, Telegraf } from "telegraf";
import { Update } from "typegram";
import { format as prettyFormat } from "pretty-format";

export class NotificationManager {
    private _bot: Telegraf<Context<Update>>;
    private chatId = 293790727;

    private options = {
        printFunctionName: false,
        highlight: true,
    };

    constructor() {
        const bot: Telegraf<Context<Update>> = new Telegraf(
            process.env.BOT_TOKEN as string
        );
        this._bot = bot;
        this._bot.launch();
    }

    async notifyTeamCreated(team: ITeam) {
        await this._bot.telegram.sendMessage(
            this.chatId,
            "*Team has been created* 🚀\n",
            { parse_mode: "MarkdownV2" }
        );
        let message = "";
        message += `\n`;
        message += `Team name: ${team.name}\n`;
        message += `List of participants:\n`;

        team.listOfParticipantsEmail.forEach(async (element) => {
            message += `${element}\n`;
        });
        await this._bot.telegram.sendMessage(this.chatId, message);
    }

    async notifyTaskTaken(team: ITeam, task: ITaskDynamic) {
        await this._bot.telegram.sendMessage(
            this.chatId,
            "*Task has been taken* ⏳\n",
            { parse_mode: "MarkdownV2" }
        );
        let message = `Team: ${team.name}`;
        message += `\n`;
        message += `Task: ${task.taskStatic.name}\n`;
        message += `Start time: ${task.startTime} \n`;
        await this._bot.telegram.sendMessage(this.chatId, message);
    }

    async notifyTaskSubmitted(team: ITeam, task: ITaskDynamic) {
        await this._bot.telegram.sendMessage(
            this.chatId,
            "*Task has been submitted* 🔺\n",
            { parse_mode: "MarkdownV2" }
        );
        let message = `Team: ${team.name}`;
        message += `\n`;
        message += `Task: ${task.taskStatic.name}\n`;
        message += `End time: ${task.endTime} \n`;
        await this._bot.telegram.sendMessage(this.chatId, message);
    }

    async notifyTaskGraded(team: ITeam, task: ITaskDynamic) {
        await this._bot.telegram.sendMessage(
            this.chatId,
            "*Task has been graded* ✅\n",
            { parse_mode: "MarkdownV2" }
        );
        let message = `Team ${team.name}`;
        message += `\n`;
        message += `Task: ${task.taskStatic.name}\n`;
        message += `Points: ${task.points} \n`;
        await this._bot.telegram.sendMessage(this.chatId, message);
    }
}

//
