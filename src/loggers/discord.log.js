'use strict'
import {Client, GatewayIntentBits} from 'discord.js'

const DISCORD_TOKEN = "MTM2MDcwMDk5MDg5Mzk4MTcxOA.Gw_JwY.ZVCXlqXlqgxWEbDvgpFL86xgUoSiKuxgdUrVYc"
const DISCORD_CHANNEL_ID = "839874422923460609"
 
const msg_reply = ['mày sủa vừa vừa thôi', 'anh là máy chém bách khoa', 'địt cụ mày thằng hà nội 2', 'thằng khải', 'vãi lồn luôn', 'sv đàm', 'thuần bợ']

class LoggerService{
  constructor(){
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    })
    
    //channelId
    this.channel_id = DISCORD_CHANNEL_ID

    this.client.on('ready', () => {
      console.log(`Logged as ${this.client.user.tag}`)
    })

    this.client.login(DISCORD_TOKEN)

    this.client.on('messageCreate', (msg) => {
      if(msg.author.bot){
        return
      }
      if(msg.content.includes('hát')){
        msg.reply(`nần ná na na anh ${msg.author.username} \n https://www.youtube.com/watch?v=iGxeKsT1rN0`)
      }else if(msg.content.includes('sex')){
        msg.reply(`ok đi thèm bú lồn em nào, lên luôn này con vợ ${msg.author.username} \n https://www.pornhub.com/`)
      }else{
        let index = Math.floor(Math.random() * msg_reply.length)
        msg.reply(` ${msg_reply[index]}.Im con cụ mày mồm vào thằng ${msg.author.username}.`)
      }
    })
  }

  sendToDiscord(message){
    const channel = this.client.channels.cache.get(this.channel_id)
    if(!channel){
      console.log('Cant find channel')
      return
    }

    channel.send(message).cache(err => console.log(err))
  }

}

export default new LoggerService()