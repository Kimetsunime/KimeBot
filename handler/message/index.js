require('dotenv').config()
const { decryptMedia, Client } = require('@open-wa/wa-automate')
const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
const { downloader, cekResi, removebg, urlShortener, meme, translate, getLocationData } = require('../../lib')
const { msgFilter, color, processTime, is } = require('../../utils')
const mentionList = require('../../utils/mention')
const { uploadImages } = require('../../utils/fetcher')
const NSFW = require("discord-nsfw"); 
const nsfw = new NSFW();
const randomItem = require('random-item');
const Mal = require('mal-scraper')
var osuAPI = '1b1ead5667971c324cadbb76f5a005be4b5fd403';
var osuUrl = "https://osu.ppy.sh/api/";
const fs = require('fs');
const fetch = require('node-fetch');
const redditApi = require('imageapi.js')
const lyricsFinder = require('lyrics-finder');
var db = require('./db.json')
var dbPath = 'handler/message/db.json'
const func = require('./function');
var search = require('youtube-search');
var opts = {
    maxResult: 10,
    key: "AIzaSyDb6aYIk8aSU_hmbQ5opWniXn4z4dQ53UY"
};
async function getUser(username, mode) {
    if(!mode) { mode = 0 };
    let response = await fetch(osuUrl+'get_user?k='+osuAPI+'&m='+mode+'&u='+username);
    let json = await response.json();
    let Yahallo = json[0]
    let img = `http://s.ppy.sh/a/${Yahallo.user_id}`;
    let modeType;
    if(!username) { 
      console.error('ERROR_MISSING_USERNAME: Error Property of \'undefined\'')
    }
    if(mode == 1) {
      modeType = 'osu!taiko'
    } else if (mode == 2) {
      modeType = 'osu!ctb'
    } else if (mode == 3) {
      modeType = 'osu!mania'
    } else  { modeType = 'osu!std' };
      Yahallo.img = img
      Yahallo.mode = modeType
    return Yahallo
  };
  
  function acc(a, b, c, d, e, f) {
  let arr = [a, b, c, d, e, f];
  //let arr1 = [];
   let num = arr.map((e) => {
     return isNaN(e)? 0 : Number(e)
   })
   
   let max = num[0] + num[1] + num[2] + num[3] + num[4]+num[5];
   if(isNaN(max)) {
     throw 'ERROR_NaN: Not a number'
   }
   let math0 = ((((300 * num[0]) + (100 * num[1]) + (50 * num[2])) / (300 * max))*100).toFixed(2);
   let math3 = ((((50*num[4])+(100*num[3])+(200*num[2])+(300*(num[1]+(num[0]))))/(300*(num[0]+num[1]+num[2]+num[3]+num[4]+num[5])))*100).toFixed(2);
  return {
    std: math0,
    mania: math3,
  }
}

async function topPlay(username, mode) {
  if(!mode) {
    mode = 0;
  }
  let data = await fetch(osuUrl+'get_user_best?k='+osuAPI+'&u='+username+`&limit=5`+`&m=`+mode);
  let json = await data.json();
  if(json.length < 5) {
    throw new Error('this player doesn\'t have more than 5 score on this mode')
  }
  if(!username) {
    console.error('ERROR_MISSING_USERNAME: Error Property of \'undefined\'')
  } else if(json[0] === undefined) {
    console.log('Not Found')
  }
  json.mode = Number(mode)
  
  return json
}

async function getRecent(username, mode) {
  if(!mode) {mode = 0}
  let data = await fetch(osuUrl+'get_user_recent?k='+osuAPI+'&u='+username+`&m=${mode}&limit=5`);
  let json = await data.json();
  if(json.length < 1) {
    console.error('This player doesn\'t recent play')
  }
  json.mode = Number(mode)
  return json
}

async function getMap(id) {
  let r = await fetch(osuUrl+'get_beatmaps?k='+osuAPI+'&b='+id);
  let data = await r.json();
  let out = data[0]
  let ids = Number(id)
  if(isNaN(ids)) {
    throw 'ERROR_NaN: Not a Number'
  }
  
  return out
}

function modList(num) {
  num = Number(num)
  var modList = [];
  if(num == 0) modList.push('NoMod')
  if(num & (1 << 0)) {
    modList.push('NF')
  }
  if(num & (1 << 1)) {
    modList.push('EZ')
  }
  if(num & (1 << 3)) {
    modList.push('HD')
  }
  if(num & (1 << 4)) {
    modList.push('HR')
  }
  if(num & (1 << 5)) {
    modList.push('SD')
  }
  if(num & (1 << 9)) {
    modList.push('NC')
  } else if(num & (1 << 6)) {
    modList.push('DT')
  }
  if(num & 1 << 7) {
    modList.push('RX')
  }
  if(num & 1 << 8) {
    modList.push('HT')
  }
  if(num & 1 << 10) {
    modList.push('FL')
  }
  if(num & 1 << 12) {
    modList.push('SO')
  }
  if(num & 1 << 14) {
    modList.push('PF')
  }
  if(num & 1 << 15) {
    modList.push('4K')
  }
  if(num & 1 << 16) {
    modList.push('5K')
  }
  if(num & 1 << 17) {
    modList.push('6K')
  }
  if(num & 1 << 18) {
    modList.push('7K')
  }
  if(num & 1 << 19) {
    modList.push('8K')
  }
  if(num & 1 << 20) {
    modList.push('FI')
  }
  if(num & 1 << 24) {
    modList.push('9K')
  }
  if(num & 1 << 25) {
    modList.push('10K')
  }
  if(num & 1 << 26) {
    modList.push('1K')
  }
  if(num & 1 << 27) {
    modList.push('2k')
  }
  if(num & 1 << 28) {
    modList.push('3K')
  }
  
  return modList
}



const { menuId, menuEn } = require('./text') // Indonesian & English menu
module.exports = msgHandler = async (client, message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, isGif, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
        let { body } = message
        const { name, formattedTitle } = chat
        let { pushname, verifiedName, formattedName } = sender
        pushname = pushname || verifiedName || formattedName // verifiedName is the name of someone who uses a business account
        const botNumber = await client.getHostNumber() + '@c.us'
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const groupMembers = isGroupMsg ? await client.getGroupMembersId(groupId) : ''
        const isGroupAdmins = groupAdmins.includes(sender.id) || false
        const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
		const redditImageFetcher = require('reddit-image-fetcher');
		
        // Bot Prefix
        const prefix = '#'
        body = (type === 'chat' && body.startsWith(prefix)) ? body : (((type === 'image' || type === 'video') && caption) && caption.startsWith(prefix)) ? caption : ''
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
        const arg = body.substring(body.indexOf(' ') + 1)
        const args = body.trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(prefix)
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
        const url = args.length !== 0 ? args[0] : ''
        const uaOverride = process.env.UserAgent

      
        if (isCmd && !isGroupMsg) { console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname)) }
        if (isCmd && isGroupMsg) { console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle)) }
        

        switch (command) {
        // Menu and TnC
        case 'speed':
        case 'ping':
            await client.sendText(from, `Pong!!!!\nSpeed: ${processTime(t, moment())} _Second_`)
            break
        case 'tnc':
            await client.sendText(from, menuId.textTnC())
            break
	case 'rules':
		await client.sendText(from, menuId.rules())
		break
        case 'menu':
        case 'help':
		const stickerAliase = ['sticker', 'stiker', 'stickers'];
            const helpAliase = ['help', 'menu'];
            const GifStickerAliase = ['gifsticker', `gifstiker`, `stikergif`, 'stickergif'];
            const tiktokAliase = ['tiktok'];
            const FbAliase = ['fb', 'facebook'];
            const IgAliase = ['ig', 'instagram'];
            const twtAliase = ['twt', 'twitter'];
            const ytAliase = ['yt', 'youtube'];
            const animeAliase = ['anime'];
            const lyricsAliase = ['lyric', 'lirik', 'lyrics'];
            const songAliase = ['song'];
            const ppAliase = ['pp', 'profile', 'avatar'];
            const convAliase = ['gs', 'getsticker', 'getstiker'];
            const IgsAliase = ['igs', 'instagramsearch'];
            let animemeAliase = ['animeme'];
            let memeAliase = ['meme'];
            let redditAliase = ['reddit', 'subreddit']
            
            if(helpAliase.includes(args[0])) { 
                await client.sendText(from, menuId.cmdHelp())
            } else if(stickerAliase.includes(args[0])) {
                await client.sendText(from, menuId.cmdSticker())
            } else if (GifStickerAliase.includes(args[0])) {
                await client.sendText(from, menuId.cmdGifSticker())
            } else if(tiktokAliase.includes(args[0])) {
                await client.sendText(from, menuId.cmdTiktok())
            } else if(FbAliase.includes(args[0])) {
                await client.sendText(from, menuId.cmdFB())
            } else if(IgAliase.includes(args[0])) {
                await client.sendText(from, menuId.cmdIG())
            } else if(twtAliase.includes(args[0])) {
                await client.sendText(from, menuId.cmdTwt())
            }else if(ytAliase.includes(args[0])) {
                await client.sendText(from, menuId.cmdYt())
            } else if(animeAliase.includes(args[0])) {
                await client.sendText(from, menuId.cmdAnime())
            } else if(lyricsAliase.includes(args[0])) {
                await client.sendText(from, menuId.cmdLyric())
            } else if(songAliase.includes(args[0])) {
                await client.sendText(from, menuId.cmdSong())
            } else if(ppAliase.includes(args[0])) {
                await client.sendText(from, menuId.cmdAvatar())
            } else if(convAliase.includes(args[0])) {
                await client.sendText(from, menuId.cmdConverter())
            } else if(IgsAliase.includes(args[0])) {
                await client.sendText(from, menuId.cmdIgs())
            } else if(memeAliase.includes(args[0])) {
                await client.sendText(from, menuId.cmdMeme())
            } else if(redditAliase.includes(args[0])) {
                await client.sendText(from, menuId.cmdReddit())
            } else if(animemeAliase.includes(args[0])) {
                await client.sendText(from, menuId.cmdAnimeme())
            } else { if(args.length > 0) {
                    client.reply(from, `I can\'t find any command named *${arg}*`)
                }
            }
            if(args.length > 0) return;
            await client.sendText(from, menuId.textMenu(pushname))
                .then(() => ((isGroupMsg) && (isGroupAdmins)) ? client.sendText(from, 'Menu Admin Grup: *#menuadmin*') : null)
            break
        case 'menuadmin':
            if (!isGroupMsg) return client.sendText(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup! [Group Only]', id)
            if (!isGroupAdmins) return client.sendText(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup! [Admin Group Only]', id)
            await client.sendText(from, menuId.textAdmin())
            break
        case 'donate':
        case 'donasi':
            await client.sendText(from, menuId.textDonasi())
            break
        // Sticker Creator
        case 'sticker':
        case 'stiker': {
            if ((isMedia || isQuotedImage) && args.length === 0) {
                const encryptMedia = isQuotedImage ? quotedMsg : message
                const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
                const mediaData = await decryptMedia(encryptMedia, uaOverride)
                const imageBase64 = `data:${_mimetype};base64,${mediaData.toString('base64')}`
                client.sendImageAsSticker(from, imageBase64).then(() => {
                    client.sendText(from, menuId.stickerSend(pushname))
                    console.log(`Sticker Processed for ${processTime(t, moment())} Second`)
                })
            } else if (args[0] === 'nobg') {
                /**
                * This is Premium feature.
                * Check premium feature at https://trakteer.id/red-emperor/showcase or chat Author for Information.
                */
                client.sendText(from, 'ehhh, what\'s that???', id)
            } else if (args.length === 1) {
                if (!is.Url(url)) { await client.sendText(from, 'Maaf, link yang kamu kirim tidak valid. [Invalid Link]', id) }
                client.sendStickerfromUrl(from, url).then((r) => (!r && r !== undefined)
                    ? client.sendText(from, 'Maaf, link yang kamu kirim tidak memuat gambar. [No Image]')
                    : client.sendText(from, 'Terimakasih Telah Menggunakan Bot Ini Jangan Lupa Subsrcibe Dan Follow Kimetsunime ID \n -YouTube:www.youtube.com/channel/UCJPVt_tSUcSOx4nK-Marwmg \n -Instagram:https://www.instagram.com/kimetsunime.id/')).then(() => console.log(`Sticker Processed for ${processTime(t, moment())} Second`))
            } else {
                await client.sendText(from, 'Tidak ada gambar! Untuk membuka daftar perintah kirim #menu [Wrong Format]', id)
            }
            break
        }
		//RS
case 'osurecent':
case 'osurs':
case 'rs': {
  getRecent(args[0], args[1])
  .then(r => {
    if(isNaN(Number(args[1])) || args[1] > 3) {args[1] = 0}
    if(args.length < 1) {
      client.sendText(from, 'please provide some username')
    }
    if(r.length < 1) {
      client.sendText(from, 'This user doesn\'t have any recent play')
    }
    var response = [];
    let loop = setInterval(pushDataRecent, 250)
    let x = 0
    
    function pushDataRecent() {
      let i = 0 + x++
      if(i == r.length) {
        clearInterval(loop)
      } else {
        let accs = [acc(r[i].count300, r[i].count100, r[i].count50, r[i].countmiss).std, 'Not Availabe Yet', 'Not Availabe Yet', acc(r[i].count300, r[i].countgeki, r[i].countkatu,r[i].count100, r[i].count50, r[i].countmiss).mania]
        getMap(r[i].beatmap_id)
        .then(data => {
          response.push(`${i+1}. ${data.title} (${Number(data.difficultyrating).toFixed(2)}☆)\n[${data.version}] => ${r[i].rank} | +${modList(r[i].enabled_mods).join('')}\n${accs[r.mode]}% | scores: ${r[i].score}`)
        })
      }
    }
    client.sendText(from, 'Getting data...')
    setTimeout(function() {
      client.sendText(from, `Recent Play for ${args[0]}\n\n${response.join('\n\n')}`)
    }, 3000);
  })
  .catch(e => {
    console.error(e)
    client.sendText(from, 'Player Not Found')
  });
  break
}
case 'osutop': {
  topPlay(args[0], args[1])
  .then(r => {
    if(isNaN(Number(args[1])) || args[1] > 3) {args[1] = 0}
    if(args.length < 1) {
      client.sendText(from, 'please provide some username')
    }
    if(r.length < 1) {
      client.sendText(from, 'This user doesn\'t have any recent play')
    }
    var response = [];
    let loop = setInterval(pushDataRecent, 250)
    let x = 0
    
    function pushDataRecent() {
      let i = 0 + x++
      if(i == r.length) {
        clearInterval(loop)
      } else {
        let accs = [acc(r[i].count300, r[i].count100, r[i].count50, r[i].countmiss).std, 'Not Availabe Yet', 'Not Availabe Yet', acc(r[i].count300, r[i].countgeki, r[i].countkatu,r[i].count100, r[i].count50, r[i].countmiss).mania]
        getMap(r[i].beatmap_id)
        .then(data => {
          response.push(`${i+1}. ${data.title} (${Number(data.difficultyrating).toFixed(2)}☆)\n[${data.version}] => ${r[i].rank} | +${modList(r[i].enabled_mods).join('')}\n${Number(r[i].pp).toFixed(2)}pp\n${accs[r.mode]}% | scores: ${r[i].score}`)
        })
      }
    }
    client.sendText(from, 'Getting data...')
    setTimeout(function() {
      client.sendText(from, `Top Play for ${args[0]}\n\n${response.join('\n\n')}`)
    }, 3000);
  })
  .catch(e => {
    console.error(e)
    client.sendText(from, e)
  });
  break
}
        case 'stikergif':
        case 'stickergif':
        case 'gifstiker':
        case 'gifsticker': {
            if (args.length !== 1) return client.sendText(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            if (is.Giphy(url)) {
                const getGiphyCode = url.match(new RegExp(/(\/|\-)(?:.(?!(\/|\-)))+$/, 'gi'))
                if (!getGiphyCode) { return client.sendText(from, 'Gagal mengambil kode giphy', id) }
                const giphyCode = getGiphyCode[0].replace(/[-\/]/gi, '')
                const smallGifUrl = 'https://media.giphy.com/media/' + giphyCode + '/giphy-downsized.gif'
                client.sendGiphyAsSticker(from, smallGifUrl).then(() => {
                    client.sendText(from, 'Terimakasih Telah Menggunakan Bot Ini Jangan Lupa Subsrcibe Dan Follow Kimetsunime ID \n -YouTube:www.youtube.com/channel/UCJPVt_tSUcSOx4nK-Marwmg \n -Instagram:https://www.instagram.com/kimetsunime.id/')
                    console.log(`Sticker Processed for ${processTime(t, moment())} Second`)
                }).catch((err) => console.log(err))
            } else if (is.MediaGiphy(url)) {
                const gifUrl = url.match(new RegExp(/(giphy|source).(gif|mp4)/, 'gi'))
                if (!gifUrl) { return client.sendText(from, 'Gagal mengambil kode giphy', id) }
                const smallGifUrl = url.replace(gifUrl[0], 'giphy-downsized.gif')
                client.sendGiphyAsSticker(from, smallGifUrl).then(() => {
                    client.sendText(from, 'Terimakasih Telah Menggunakan Bot Ini Jangan Lupa Subsrcibe Dan Follow Kimetsunime ID \n -YouTube:www.youtube.com/channel/UCJPVt_tSUcSOx4nK-Marwmg \n -Instagram:https://www.instagram.com/kimetsunime.id/')
                    console.log(`Sticker Processed for ${processTime(t, moment())} Second`)
                }).catch((err) => console.log(err))
            } else {
                await client.sendText(from, 'maaf, untuk saat ini sticker gif hanya bisa menggunakan link dari giphy.  [Giphy Only]', id)
            }
            break
        }
        // Video Downloader
        case 'tiktok':
            if (args.length !== 1) return client.sendText(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            if (!is.Url(url) && !url.includes('tiktok.com')) return client.sendText(from, 'Maaf, link yang kamu kirim tidak valid. [Invalid Link]', id)
            await client.sendText(from, `_Scraping Metadata..._ \n\n${menuId.textDonasi()}`, id)
            downloader.tiktok(url).then(async (videoMeta) => {
                const filename = videoMeta.authorMeta.name + '.mp4'
                const caps = `*Metadata:*\nUsername: ${videoMeta.authorMeta.name} \nMusic: ${videoMeta.musicMeta.musicName} \nView: ${videoMeta.playCount.toLocaleString()} \nLike: ${videoMeta.diggCount.toLocaleString()} \nComment: ${videoMeta.commentCount.toLocaleString()} \nShare: ${videoMeta.shareCount.toLocaleString()} \nCaption: ${videoMeta.text.trim() ? videoMeta.text : '-'}`
                await client.sendFileFromUrl(from, videoMeta.url, filename, videoMeta.NoWaterMark ? caps : `⚠ Video tanpa watermark tidak tersedia. \n\n${caps}`, '', { headers: { 'User-Agent': 'okhttp/4.5.0', referer: 'https://www.tiktok.com/' } }, true)
                    .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                    .catch((err) => console.error(err))
            }).catch(() => client.sendText(from, 'Gagal mengambil metadata, link yang kamu kirim tidak valid. [Invalid Link]', id))
            break
        case 'ig':
        case 'instagram':
            if (args.length !== 1) return client.sendText(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            if (!is.Url(url) && !url.includes('instagram.com')) return client.sendText(from, 'Maaf, link yang kamu kirim tidak valid. [Invalid Link]', id)
            await client.sendText(from, `_Scraping Metadata..._ \n\n${menuId.textDonasi()}`, id)
            downloader.insta(url).then(async (data) => {
                if (data.type == 'GraphSidecar') {
                    if (data.image.length != 0) {
                        data.image.map((x) => client.sendFileFromUrl(from, x, 'photo.jpg', '', null, null, true))
                            .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                            .catch((err) => console.error(err))
                    }
                    if (data.video.length != 0) {
                        data.video.map((x) => client.sendFileFromUrl(from, x.videoUrl, 'video.jpg', '', null, null, true))
                            .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                            .catch((err) => console.error(err))
                    }
                } else if (data.type == 'GraphImage') {
                    client.sendFileFromUrl(from, data.image, 'photo.jpg', '', null, null, true)
                        .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                        .catch((err) => console.error(err))
                } else if (data.type == 'GraphVideo') {
                    client.sendFileFromUrl(from, data.video.videoUrl, 'video.mp4', '', null, null, true)
                        .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                        .catch((err) => console.error(err))
                }
            })
                .catch((err) => {
                    console.log(err)
                    if (err === 'Not a video') { return client.sendText(from, 'Error, tidak ada video di link yang kamu kirim. [Invalid Link]', id) }
                    client.sendText(from, 'Error, user private atau link salah [Private or Invalid Link]', id)
                })
            break
        case 'twt':
        case 'twitter':
            if (args.length !== 1) return client.sendText(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            if (!is.Url(url) & !url.includes('twitter.com') || url.includes('t.co')) return client.sendText(from, 'Maaf, url yang kamu kirim tidak valid. [Invalid Link]', id)
            await client.sendText(from, `_Scraping Metadata..._ \n\n${menuId.textDonasi()}`, id)
            downloader.tweet(url).then(async (data) => {
                if (data.type === 'video') {
                    const content = data.variants.filter(x => x.content_type !== 'application/x-mpegURL').sort((a, b) => b.bitrate - a.bitrate)
                    const result = await urlShortener(content[0].url)
                    console.log('Shortlink: ' + result)
                    await client.sendFileFromUrl(from, content[0].url, 'video.mp4', `Link Download: ${result} \n\nProcessed for ${processTime(t, moment())} _Second_`, null, null, true)
                        .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                        .catch((err) => console.error(err))
                } else if (data.type === 'photo') {
                    for (let i = 0; i < data.variants.length; i++) {
                        await client.sendFileFromUrl(from, data.variants[i], data.variants[i].split('/media/')[1], '', null, null, true)
                            .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                            .catch((err) => console.error(err))
                    }
                }
            })
                .catch(() => client.sendText(from, 'Maaf, link tidak valid atau tidak ada media di link yang kamu kirim. [Invalid Link]'))
            break
        case 'fb':
        case 'facebook':
            if (args.length !== 1) return client.sendText(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            if (!is.Url(url) && !url.includes('facebook.com')) return client.sendText(from, 'Maaf, url yang kamu kirim tidak valid. [Invalid Link]', id)
            await client.sendText(from, '_Scraping Metadata..._ \n\nTerimakasih Telah Menggunakan Bot Ini Jangan Lupa Subsrcibe Dan Follow Kimetsunime ID \n -YouTube:www.youtube.com/channel/UCJPVt_tSUcSOx4nK-Marwmg \n -Instagram:https://www.instagram.com/kimetsunime.id/', id)
            downloader.facebook(url).then(async (videoMeta) => {
                const title = videoMeta.response.title
                const thumbnail = videoMeta.response.thumbnail
                const links = videoMeta.response.links
                const shorts = []
                for (let i = 0; i < links.length; i++) {
                    const shortener = await urlShortener(links[i].url)
                    console.log('Shortlink: ' + shortener)
                    links[i].short = shortener
                    shorts.push(links[i])
                }
                const link = shorts.map((x) => `${x.resolution} Quality: ${x.short}`)
                const caption = `Text: ${title} \n\nLink Download: \n${link.join('\n')} \n\nProcessed for ${processTime(t, moment())} _Second_`
                await client.sendFileFromUrl(from, thumbnail, 'videos.jpg', caption, null, null, true)
                    .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                    .catch((err) => console.error(err))
            })
                .catch((err) => client.sendText(from, `Error, url tidak valid atau tidak memuat video. [Invalid Link or No Video] \n\n${err}`, id))
            break
        // Other Command
        case 'meme':
            if ((isMedia || isQuotedImage) && args.length >= 2) {
                const top = arg.split('|')[0]
                const bottom = arg.split('|')[1]
                const encryptMedia = isQuotedImage ? quotedMsg : message
                const mediaData = await decryptMedia(encryptMedia, uaOverride)
                const getUrl = await uploadImages(mediaData, false)
                const ImageBase64 = await meme.custom(getUrl, top, bottom)
                client.sendFile(from, ImageBase64, 'image.png', '', null, true)
                    .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                    .catch((err) => console.error(err))
            } else {
                await client.sendText(from, 'Tidak ada gambar! Untuk membuka cara penggnaan kirim #menu [Wrong Format]', id)
            }
            break
        case 'resi':
            if (args.length !== 2) return client.sendText(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            const kurirs = ['jne', 'pos', 'tiki', 'wahana', 'jnt', 'rpx', 'sap', 'sicepat', 'pcp', 'jet', 'dse', 'first', 'ninja', 'lion', 'idl', 'rex']
            if (!kurirs.includes(args[0])) return client.sendText(from, `Maaf, jenis ekspedisi pengiriman tidak didukung layanan ini hanya mendukung ekspedisi pengiriman ${kurirs.join(', ')} Tolong periksa kembali.`)
            console.log('Memeriksa No Resi', args[1], 'dengan ekspedisi', args[0])
            cekResi(args[0], args[1]).then((result) => client.sendText(from, result))
            break
        case 'translate':
            if (args.length != 1) return client.sendText(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            if (!quotedMsg) return client.sendText(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            const quoteText = quotedMsg.type == 'chat' ? quotedMsg.body : quotedMsg.type == 'image' ? quotedMsg.caption : ''
            translate(quoteText, args[0])
                .then((result) => client.sendText(from, result))
                .catch(() => client.sendText(from, '[Error] Kode bahasa salah atau server bermasalah.'))
            break
        case 'ceklok':
        case 'ceklokasi':
            if (!quotedMsg || quotedMsg.type !== 'location') return client.sendText(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            console.log(`Request Status Zona Penyebaran Covid-19 (${quotedMsg.lat}, ${quotedMsg.lng}).`)
            const zoneStatus = await getLocationData(quotedMsg.lat, quotedMsg.lng)
            if (zoneStatus.kode !== 200) client.sendText(from, 'Maaf, Terjadi error ketika memeriksa lokasi yang anda kirim.')
            let data = ''
            for (let i = 0; i < zoneStatus.data.length; i++) {
                const { zone, region } = zoneStatus.data[i]
                const _zone = zone == 'green' ? 'Hijau* (Aman) \n' : zone == 'yellow' ? 'Kuning* (Waspada) \n' : 'Merah* (Bahaya) \n'
                data += `${i + 1}. Kel. *${region}* Berstatus *Zona ${_zone}`
            }
            const text = `*CEK LOKASI PENYEBARAN COVID-19*\nHasil pemeriksaan dari lokasi yang anda kirim adalah *${zoneStatus.status}* ${zoneStatus.optional}\n\nInformasi lokasi terdampak disekitar anda:\n${data}`
            client.sendText(from, text)
            break
        // Group Commands (group admin only)
        case 'kick':
            if (!isGroupMsg) return client.sendText(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup! [Group Only]', id)
            if (!isGroupAdmins) return client.sendText(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup! [Admin Group Only]', id)
            if (!isBotGroupAdmins) return client.sendText(from, 'Gagal, silahkan tambahkan bot sebagai admin grup! [Bot Not Admin]', id)
            if (mentionedJidList.length === 0) return client.sendText(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            if (mentionedJidList[0] === botNumber) return await client.sendText(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            await client.sendTextWithMentions(from, `Request diterima, mengeluarkan:\n${mentionedJidList.map(x => `@${x.replace('@c.us', '')}`).join('\n')}`)
            for (let i = 0; i < mentionedJidList.length; i++) {
                if (groupAdmins.includes(mentionedJidList[i])) return await client.sendText(from, 'Gagal, kamu tidak bisa mengeluarkan admin grup.')
                await client.removeParticipant(groupId, mentionedJidList[i])
            }
            break
        case 'promote':
            if (!isGroupMsg) return await client.sendText(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup! [Group Only]', id)
            if (!isGroupAdmins) return await client.sendText(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup! [Admin Group Only]', id)
            if (!isBotGroupAdmins) return await client.sendText(from, 'Gagal, silahkan tambahkan bot sebagai admin grup! [Bot not Admin]', id)
            if (mentionedJidList.length != 1) return client.sendText(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format, Only 1 user]', id)
            if (groupAdmins.includes(mentionedJidList[0])) return await client.sendText(from, 'Maaf, user tersebut sudah menjadi admin. [Bot is Admin]', id)
            if (mentionedJidList[0] === botNumber) return await client.sendText(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            await client.promoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `Request diterima, menambahkan @${mentionedJidList[0].replace('@c.us', '')} sebagai admin.`)
            break
        case 'demote':
            if (!isGroupMsg) return client.sendText(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup! [Group Only]', id)
            if (!isGroupAdmins) return client.sendText(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup! [Admin Group Only]', id)
            if (!isBotGroupAdmins) return client.sendText(from, 'Gagal, silahkan tambahkan bot sebagai admin grup! [Bot not Admin]', id)
            if (mentionedJidList.length !== 1) return client.sendText(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format, Only 1 user]', id)
            if (!groupAdmins.includes(mentionedJidList[0])) return await client.sendText(from, 'Maaf, user tersebut tidak menjadi admin. [user not Admin]', id)
            if (mentionedJidList[0] === botNumber) return await client.sendText(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            await client.demoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `Request diterima, menghapus jabatan @${mentionedJidList[0].replace('@c.us', '')}.`)
            break
        case 'bye':
            if (!isGroupMsg) return client.sendText(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup! [Group Only]', id)
            if (!isGroupAdmins) return client.sendText(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup! [Admin Group Only]', id)
            client.sendText(from, 'Good bye... ( ⇀‸↼‶ )').then(() => client.leaveGroup(groupId))
            break
        case 'del':
            if (!isGroupAdmins) return client.sendText(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup! [Admin Group Only]', id)
            if (!quotedMsg) return client.sendText(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            if (!quotedMsgObj.fromMe) return client.sendText(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
            break
        case 'tagall':
        case 'everyone':
            /**
            * This is Premium feature.
            * Check premium feature at https://trakteer.id/red-emperor/showcase or chat Author for Information.
            */
            client.sendText(from, 'ehhh, what\'s that??? \n Check premium feature at https://trakteer.id/red-emperor/showcase or chat Author for Information', id)
            break
        case 'botstat': {
            const loadedMsg = await client.getAmountOfLoadedMessages()
            const chatIds = await client.getAllChatIds()
            const groups = await client.getAllGroups()
            client.sendText(from, `Status :\n- *${loadedMsg}* Loaded Messages\n- *${groups.length}* Group Chats\n- *${chatIds.length - groups.length}* Personal Chats\n- *${chatIds.length}* Total Chats`)
            break
        }
		//randomItem
		case 'gacha' : {
			randomItem(['Congratulation You Got Diluc!', 'Congratulation You Got Venti!', 'Congratulation You Got Klee!', 'Congratulation You Got Mona!', 'Congratulation You Got Zhongli!']);
			client.sendText(from, `${randomItem}`)
			break
		}
		//YTDL
		case 'kmsong': {
	const ytdl = require('ytdl-core');
	const Youtube = require('discord-youtube-api');

	var YouTubeAPI = new Youtube('AIzaSyDb6aYIk8aSU_hmbQ5opWniXn4z4dQ53UY')
	
	//function ini jangn dhps
    function ytUrlConverter(links) {
      if(!links) return console.error('missing youtube shorter link!')
      let ytExp = new RegExp(/https:?\/\/(www\.)?(youtu\.be)\/\w[-a-zA-Z0-9_\-]{5,70}/i);
      function ytGetIdByLink(ytlink) {
        if (!ytlink) return undefined;
        let XP = new RegExp(/\w[-a-zA-Z0-9_%]{5,70}$/i)
        return ytlink.match(XP);
      }
      if(!ytExp.test(links)) {
        console.error('Not Valid youtube Shorter Link')
        console.error('Error: no links were found')
      } else return `https://www.youtube.com/watch?v=${ytGetIdByLink(links)}`
    }
	
    let linkyt = ytUrlConverter(args[0])
    var rExp = new RegExp (/https:?\/\/(www\.)?(youtu\.be)\/\w[-a-zA-Z0-9_\-]{5,70}/gi)
    let isYtUrl = rExp.test(args[0]);
    let outputLink = isYtUrl ? ytUrlConverter(args[0]) : args[0];
    //dah
    
    if(args.length < 1 ) return client.sendText(from, 'Please give the song Url. that must be a youtube link!')
    if(!is.Url(args[0])) return client.sendText(from, 'That\'s not a valid url')
    const YtDuration = YouTubeAPI.getVideo(outputLink);
    if((await YtDuration).duration.minutes > 9) {
        if((await YtDuration).duration.seconds > 0) {
            return client.sendText(from, 'The video duration is maxed to 9 Minutes. why? cuz im downloading every video you put')
        }
    } else if((await YtDuration).duration.hours > 0 ) {
        return client.sendText(from, 'The video duration is maxed to 9 Minutes. why? cuz im downloading every video you put')
    }
    await ytdl(outputLink, { filter: 'audioonly' })
    .pipe(fs.createWriteStream('song.mp3')).on('finish', () => {
        console.log('Done!')
        client.sendText(from, 'Music Terdownload,Tunggu Beberapa Saat Lagi Server Mencoba Mengirim File \n Sambil Menunggu Boleh Lah Subsrcibe Dan Follow Kimetsunime ID \n -YouTube:www.youtube.com/channel/UCJPVt_tSUcSOx4nK-Marwmg \n -Instagram:https://www.instagram.com/kimetsunime.id/')
        search(args[0], opts, function(err, results) {
               client.sendAudio(from, 'song.mp3', results[0].title)
        })
    })

    break
}
		//YTSearch
		case 'yt' :
        case 'youtube' : {
            if(args.length < 1) return client.sendText(from, 'Please write something')
            if(args[0] === '-p') {
                let youtubePlaylist = await YouTubeAPI.getPlaylist(arg.slice(1))
                console.log(youtubePlaylist)
            } 
            search(arg, opts, function(err, results) {
               if(results[0].id) {
                    if(err) return client.sendText(from, '-ERROR')
                    if(results[0].link.includes('/channel/')) {
                    client.sendFileFromUrl(from, results[0].thumbnails.high.url, `${results[0].title}.jpg`, `*_Search Results_*\n\n*Channel Name* ${results[0].channelTitle}\n*Channel ID:* ${results[0].channelId}\n*Channel Url:* ${results[0].link}\n*Created At:* ${results[0].publishedAt}\n\n*Channel Description:* ${results[0].description}`).catch(err => {

                        })
                    } else {
                        client.sendFileFromUrl(from, results[0].thumbnails.high.url, `${results[0].title}.jpg`, `*_Search Results_*\n\n*Title:* ${results[0].title}\n*Video ID:* ${results[0].id}\n*Videp Url:* ${results[0].link}\n*Channel Name:* ${results[0].channelTitle}\n*Published At:* ${results[0].publishedAt}\n\n*Description:* ${results[0].description}`).catch(err => {
                        client.sendText(from, 'Not Found')
                        })
                    }
                } else {
                    client.sendText(from, 'Not Found')
                }
               
            });
            break
        }
		//Dev
		case 'bai': {
  if(!['6281913861797@c.us', '6281337614453@c.us', '6285765618054@c.us'].includes(sender.id)) return client.sendText(from, 'You don\'t have permission to use this command.\nOnly the developer can use this command')
  if(args.length < 1) return client.sendText(from, 'Missing Argument')
  try {
    eval(arg);
  } catch(err) {
    client.sendText(from, err) || client.sendText(from, err.message)
  }

  break;
}
		//NSFW
		case 'kmn' : {
			var option = ['Lewd', 'Hentaithigh', 'Kitsune', 'Erokemo', 'Hentai', 'Nekotits', 'Nekopussy', 'Nekofeet', 'Wallpaper']

if(isGroupMsg) return client.sendText('Tidak Bisa Digunakan Di Grup,Private Chat Saja!');
if(args[0] === 'wallpaper') {
    const image = await nsfw.wallpaper();
    client.sendFileFromUrl(from, image, 'nsfw.jpg', 'Terimakasih Telah Menggunakan Bot Ini Jangan Lupa Subsrcibe Dan Follow Kimetsunime ID \n -YouTube:www.youtube.com/channel/UCJPVt_tSUcSOx4nK-Marwmg \n -Instagram:https://www.instagram.com/kimetsunime.id/');
} else if(args[0] === 'lewd') {
    const image = await nsfw.lewd();
    client.sendFileFromUrl(from, image, 'nsfw.jpg', 'Terimakasih Telah Menggunakan Bot Ini Jangan Lupa Subsrcibe Dan Follow Kimetsunime ID \n -YouTube:www.youtube.com/channel/UCJPVt_tSUcSOx4nK-Marwmg \n -Instagram:https://www.instagram.com/kimetsunime.id/');
} else if(args[0] === 'nekopussy') {
    const image = await nsfw.nekopussy();
    client.sendFileFromUrl(from, image, 'nsfw.jpg', 'Terimakasih Telah Menggunakan Bot Ini Jangan Lupa Subsrcibe Dan Follow Kimetsunime ID \n -YouTube:www.youtube.com/channel/UCJPVt_tSUcSOx4nK-Marwmg \n -Instagram:https://www.instagram.com/kimetsunime.id/');
} else if(args[0] === 'hentai') {
    const image = await nsfw.hentai();
    client.sendFileFromUrl(from, image, 'nsfw.jpg', 'Terimakasih Telah Menggunakan Bot Ini Jangan Lupa Subsrcibe Dan Follow Kimetsunime ID \n -YouTube:www.youtube.com/channel/UCJPVt_tSUcSOx4nK-Marwmg \n -Instagram:https://www.instagram.com/kimetsunime.id/');
} else if(args[0] === 'nekofeet') {
    const image = await nsfw.nekofeet();
    client.sendFileFromUrl(from, image, 'nsfw.jpg', 'Terimakasih Telah Menggunakan Bot Ini Jangan Lupa Subsrcibe Dan Follow Kimetsunime ID \n -YouTube:www.youtube.com/channel/UCJPVt_tSUcSOx4nK-Marwmg \n -Instagram:https://www.instagram.com/kimetsunime.id/');
} else if(args[0] === 'nekotits') {
    const image = await nsfw.nekotits();
    client.sendFileFromUrl(from, image, 'nsfw.jpg', 'Terimakasih Telah Menggunakan Bot Ini Jangan Lupa Subsrcibe Dan Follow Kimetsunime ID \n -YouTube:www.youtube.com/channel/UCJPVt_tSUcSOx4nK-Marwmg \n -Instagram:https://www.instagram.com/kimetsunime.id/');
} else if(args[0] === 'erokemo') {
    const image = await nsfw.erokemo();
    client.sendFileFromUrl(from, image, 'nsfw.jpg', 'Terimakasih Telah Menggunakan Bot Ini Jangan Lupa Subsrcibe Dan Follow Kimetsunime ID \n -YouTube:www.youtube.com/channel/UCJPVt_tSUcSOx4nK-Marwmg \n -Instagram:https://www.instagram.com/kimetsunime.id/');
} else if(args[0] === 'kitsune') {
    const image = await nsfw.kitsune();
    client.sendFileFromUrl(from, image, 'nsfw.jpg', 'Terimakasih Telah Menggunakan Bot Ini Jangan Lupa Subsrcibe Dan Follow Kimetsunime ID \n -YouTube:www.youtube.com/channel/UCJPVt_tSUcSOx4nK-Marwmg \n -Instagram:https://www.instagram.com/kimetsunime.id/');
}else if(args[0] === 'hentaithigh') {
    const image = await nsfw.hentaithigh();
    client.sendFileFromUrl(from, image, 'nsfw.jpg', 'Terimakasih Telah Menggunakan Bot Ini Jangan Lupa Subsrcibe Dan Follow Kimetsunime ID \n -YouTube:www.youtube.com/channel/UCJPVt_tSUcSOx4nK-Marwmg \n -Instagram:https://www.instagram.com/kimetsunime.id/');
} else {
    await client.sendText(from, 'Error Object\n here\'s \n all th object you\'ll need:' + `\n${option}` )
}
			break
		}
		case 'reddit':
case 'subreddit': {
    if(args.length < 1 ) return client.sendText(from, 'You have to give subreddit name to use this command!')
    let animeme = await redditApi.advanced(args[0])
      console.log(`${pushname} trying to find r/${args[0]} subReddit`)
      console.log(animeme)
      if(animeme.img === undefined ) return await client.sendText(from, `\`\`\`Error: Results is Undefined or subReddit doesn\'t exist\`\`\``)
      await client.sendText(from, 'Sending...').then(() => {
          if(!animeme.img.includes('.png') && !animeme.img.includes('.jpg')) return client.sendText(from, `Failed to send picture\nError: \`\`\`Wrong File Format. It\'s not a Picture\n\nGiven Error link: ${animeme.img}\`\`\``) //give a img link even though the command canceled
          client.sendFileFromUrl(from, animeme.img, 'animeme.jpeg', `*Results*\n\n*title*: ${animeme.title != animeme.img ? animeme.title : '-'}\n*Author:* ${animeme.author}\n*Upvotes:* ${animeme.upvotes}\n\n*From _r/${args[0]}_*`)
      }) //if you see (animeme.title === animeme.img ? animeme.title : '-') thats will check if anime.title are the same with anime.img. '===' means its literally same.

    break
}
		//Giphy
		case 'giphy': {
    var giphy = 'http://api.giphy.com/v1/gifs/search?q=';
    var giphyAPI = 'wYE5P3Cqn2mzqaV2vpT10ETDBRnuMQLh';
    
    async function image(arg) {
      let response = await fetch(giphy+arg.replace(' ','+')+'&api_key='+giphyAPI+'&limit=10')
      let json = await response.json();
      const output = json.data
      return output
    };
    //di bawah itu usage
    image(arg).then(data => {
      let x = data.length+1;
      let i = Math.floor(Math.random() * x);
      if(args.length < 1) {
          client.sendText(from, 'ERROR: Missing Argument')
      }
      if(!data[i]) { 
        console.error('Maaf kak, ad error di Math.floor. mencoba 3 kali lagi\n-ISLA')
        for(let y = 0; !data[i] && y < 3; y++) {
            i = Math.floor(Math.random() * x)
            console.log('Hai ketemu :D')
        }
        if(!data[i]) return client.sendText(from, 'Not found')
      }
      client.sendGiphy(from, data[i].images.downsized_medium.url, `Results\n\n*title:* ${data[i].title}\n*Url:* ${data[i].images.downsized_medium.url}`)
      
    }).catch(err => {
        console.error(err)
        client.sendText(from, 'Not Found')
    })
        
        
    break
}
case 'anime': {
            if(args.length < 1) return client.reply(from,'You need to provide something!')
            Mal.getInfoFromName(arg)
            .then((data) => {
                if (data.title === undefined ) return client.reply(from, `I can\'t find any Anime named ${arg}`)
                if(data.genres.includes('Hentai')){
                    if(isGroupMsg) return client.reply(from, `${pushname}, sorry for disappointing you, but you can only search *NSFW* anime at DM`)
                
                } else if(!isGroupMsg) {
                    console.log(`${pushname} has searching ${data.title} (NSFW) in DM`)
                    client.sendFileFromUrl(from, data.picture)
                    client.sendText(from, `*_Search Results_*\n\n*Anime Name:* ${data.title}\n*English:* ${data.englishTitle}\n*Japanese:* ${data.japaneseTitle}\n*Synonyms:* ${data.synonyms}\n*type:* ${data.type}\n*Total Episodes:* ${data.episodes}\n*Genre:* ${data.genres}\n*Studio:* ${data.studios}\n*Source:* ${data.source}\n*Status:* ${data.status}\n*Rating:* ${data.score}/10\n\n*Synopsis:* ${data.synopsis}\n\n`)
                }
                console.log(`${pushname} has searching ${data.title} in ${formattedTitle}`)
                client.sendFileFromUrl(from, data.picture)
                client.sendText(from, `*_Search Results_*\n\n*Anime Name:* ${data.title}\n*English:* ${data.englishTitle}\n*Japanese:* ${data.japaneseTitle}\n*Synonyms:* ${data.synonyms}\n*type:* ${data.type}\n*Total Episodes:* ${data.episodes}\n*Genre:* ${data.genres}\n*Studio:* ${data.studios}\n*Source:* ${data.source}\n*Status:* ${data.status}\n*Rating:* ${data.score}/10\n\n*Synopsis:* ${data.synopsis}\n\n`)
            }).catch(e => console.log(e))
            break
        }
		case 'lirik':
        case 'lyric':
        case 'lyrics': {
            (async function(title) {
                let lyrics = await lyricsFinder(title) || "Not Found!";
                if(args.length < 1) return client.reply('Please write the song title')
                client.sendText(from, lyrics)
                console.log(`${pushname} searching Lyrics in ${formattedTitle}`);
            })(arg);
            

            break
        }
		//Osu
case 'osu' : {
    getUser(args[0], args[1])
    .then(r => {
      if(args.length < 1) return client.sendText(from, 'You must provide something')
      client.sendFileFromUrl(from, r.img, r.username+'.jpg', `*Results*\n\n*username:* ${r.username} | (${r.user_id})\n*${r.mode}*\n*level:* ${Number(r.level).toFixed(2)}\n*Accuracy:* ${Number(r.accuracy).toFixed(2)}%\n*PP:* ${r.pp_raw} | (#${r.pp_rank}) => (${r.country}#${r.pp_country_rank})\n*Play Count:* ${r.playcount}\n\n╔ *SS+:* ${r.count_rank_ssh}\n╠ *SS:* ${r.count_rank_ss}\n╠ *S+:* ${r.count_rank_sh}\n╠ *S:* ${r.count_rank_s}\n╚ *A:* ${r.count_rank_a}`)
      console.log(r)
    })
    .catch(e => {
      console.error(e)
      client.sendText(from, 'Username Not Found')
    });
  }
            break
        }
    } catch (err) {
        console.error(color(err, 'red'))
    }
}
