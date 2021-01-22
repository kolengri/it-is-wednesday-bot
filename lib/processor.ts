import request from "./request";
import { SendMessage, Update } from "./telegram/telegram";
const MAIN_URL = "https://fucking-great-advice.ru/api/random";

export class Processor {
  private processor = {};
  constructor() {
    this.processor = {
      "/info": this.about.bind(this),
      "/чтоумеешь": this.idk.bind(this),
      "/наконец полезный, блять бот!": this.aga.bind(this),
      "/yo": this.yo.bind(this),
      "/a": this.advice.bind(this),
    };
  }

  unknown() {
    return "Да ничего!))))";
  }
  about() {
    return "доступные команды: */a*, */info*, */yo*";
  }
  yo() {
    return "yo👍";
  }
  idk() {
    return "Ничего))00))))";
  }
  aga() {
    return "Еще бы))00))))";
  }
  async advice() {
    try {
      const r = (await request({ url: MAIN_URL })) as any;
      return r.text;
    } catch (e) {
      console.log("server error", e);
      return "уупс, что то пошло не так :(";
    }
  }
  async process(
    update: Update
  ): Promise<(SendMessage & { method: string }) | null> {
    if (!update.message.chat.id) {
      return null;
    }
    const processor = this.processor[update.message.text] || this.unknown;
    const text = await processor(update);
    return {
      chat_id: update.message.chat.id,
      method: "sendMessage",
      text,
    };
  }
}
