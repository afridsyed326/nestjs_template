import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import puppeteer from 'puppeteer';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() res: Response): void {
    const filePath = join(__dirname, '..', 'public', 'index.html');
    res.sendFile(filePath);
  }

  @Get('/puppeteer')
  async getPdf(@Res() res: Response) {
    try {
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();

      await page.goto('https://sbproperties.vercel.app/Brochure.html', {
        waitUntil: 'networkidle0',
      });

      const pdf = await page.pdf({
        format: 'a4',
        printBackground: true,
      });

      await browser.close();

      res.setHeader('Content-Disposition', 'attachment; filename="file.pdf"');
      res.setHeader('Content-Type', 'application/pdf');

      return res.send(pdf);
    } catch (error) {
      console.error('Error generating PDF:', error);
      return res.status(500).send('Internal Server Error');
    }
  }
}
