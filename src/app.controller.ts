import { Controller, Get, Post, Body, Param, Header, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  //add content and link to this content
  @Post('/link.json')
  //@UseGuards(AuthGuard('jwt'))
  addLink(
    @Body('content') content: string
  ) {
    const mimeType = this.appService.langDetect(content);
    return  this.appService.addLink(content, mimeType);
  }

  //GET content (the content can be text/json/js/xml....) that is in url_id link
  //set the content-type header according the content language
  @Get('/link/:url_id')
  async getContent(@Param('url_id') url_id: string,
    @Res() res){
    const content = await this.appService.getContent(url_id);
    //console.log('$$$ get content', content);
    res.set('content-type', content.mime_type)
    res.send(content.content);
  }
}
