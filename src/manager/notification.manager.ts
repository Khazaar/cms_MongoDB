import { ITaskDynamic } from "./../models/taskDynamic.model";
import { ITeam } from "./../models/team.model";
import { Context, Telegraf } from "telegraf";
import { Update } from "typegram";
import { TwitterApi, TwitterApiReadWrite, UserV2Result } from "twitter-api-v2";
import logger from "../services/logger.service";

export class NotificationManager {
    private _bot: Telegraf<Context<Update>>;
    private twitterClient: TwitterApiReadWrite;
    private chatIdStr = process.env.CHAT_ID;
    private chatId: number = Number(this.chatIdStr);
    private twitterId = 1436597742906880005;

    constructor() {
        const bot: Telegraf<Context<Update>> = new Telegraf(
            process.env.BOT_TOKEN2 as string
        );
        this._bot = bot;
        this._bot.launch();
        // this.twitterClient = new TwitterApi({
        //     appKey: process.env.TW_API_KEY as string,
        //     appSecret: process.env.TW_API_KEY_SECRET as string,
        // });
        this.twitterClient = new TwitterApiReadWrite({
            appKey: process.env.TW_APP_KEY as string,
            appSecret: process.env.TW_APP_SECRET as string,
            accessToken: process.env.TW_ACCESS_TOKEN as string,
            accessSecret: process.env.TW_ACCESS_SECRET as string,
        });
    }

    async notifyTeamCreated(team: ITeam) {
        try {
            let message = "Team has been created 🚀\n";
            message += `\n`;
            message += `Team name: ${team.name}\n`;
            message += `List of participants:\n`;

            team.listOfParticipantsEmail.forEach(async (element) => {
                message += `${element}\n`;
            });
            //await this._bot.telegram.sendMessage(this.chatId, message);
            //await this.twitterClient.v2.tweet(message);
        } catch (error) {
            throw new Error(error as any);
        }
    }

    async notifyTaskTaken(team: ITeam, task: ITaskDynamic) {
        try {
            let message = "Task has been taken ⏳\n";
            message += `\n`;
            message += `Team: ${team.name}\n`;
            message += `Task: ${task.taskStatic.name}\n`;
            message += `Start time: ${task.startTime} \n`;
            await this._bot.telegram.sendMessage(this.chatId, message);
            await this.twitterClient.v2.tweet(message);
        } catch (error) {
            throw new Error(error as any);
        }
    }

    async notifyTaskSubmitted(team: ITeam, task: ITaskDynamic) {
        try {
            let message = "Task has been submitted 🔺\n";
            message += `Team: ${team.name}\n`;
            message += `\n`;
            message += `Task: ${task.taskStatic.name}\n`;
            message += `End time: ${task.endTime} \n`;
            await this._bot.telegram.sendMessage(this.chatId, message);
            await this.twitterClient.v2.tweet(message);
        } catch (error) {
            throw new Error(error as any);
        }
    }

    async notifyTaskGraded(team: ITeam, task: ITaskDynamic) {
        try {
            let message = "Task has been graded ✅\n";
            message += `Team ${team.name}\n`;
            message += `\n`;
            message += `Task: ${task.taskStatic.name}\n`;
            message += `Points: ${task.points} \n`;
            await this._bot.telegram.sendMessage(this.chatId, message);
            await this.twitterClient.v2.tweet(message);
        } catch (error) {
            throw new Error(error as any);
        }
    }

    async notifyTwitter(msg: string) {
        try {
            const username: UserV2Result = await this.twitterClient.v2.user(
                this.twitterId.toString()
            );
            const response = await this.twitterClient.v2.tweet(msg);

            logger.info(response);
        } catch (error) {
            throw new Error(error as any);
        }
    }
}

//
