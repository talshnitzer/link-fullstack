import { Inject, Injectable } from '@nestjs/common';
import { MASSIVE_CONNECTION } from '@nestjsplus/massive';
const randomstring = require("randomstring");
const highlight      = require("highlight.js");
const mime = require('mime');
mime._types.javascript = mime._types.js;


const error = (e) => {
  console.log('error object:', e);
  
  return JSON.stringify({error: e.errmsg});
}

@Injectable()
export class AppService {
  constructor(
    @Inject(MASSIVE_CONNECTION) private readonly db
  ) {}
  
  langDetect(content: string): string {
    const language = highlight.highlightAuto(content).language;
    const type = mime.getType(language) || 'text/plain';
    //console.log('^^^^content, language , type:', content, language, type);
    return type;
  }

  async addLink(content: string, mime_type: string) { 
    const created_at = new Date;
    const public_id: string = randomstring.generate({
      length: 5,
      capitalization: 'lowercase',
      charset: 'alphanumeric'
    });
    const newContent = {
        content,
        created_at,
        public_id,
        mime_type
    }
    try {
      
        await this.db.my_content.save(newContent);
        const table = await this.db.my_content.find({});
        //console.log('**** table', table);
        
        return {url: newContent.public_id}
        
    } catch (e) {
        return error(e);
    }
  }

  async getContent(url_id: string){
    try {
      const contentArr = await this.db.my_content.findOne({public_id: url_id}, {fields: ['content', 'mime_type']})
      //console.log('%%% content, mime-type', contentArr);
      return contentArr;
    } catch (e) {
      return error(e);
    }
  }
}




