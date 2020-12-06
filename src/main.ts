import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { WsAdapter } from '@nestjs/platform-ws';



async function bootstrap() {
  const logger = new Logger('bootstrap')
  
  var cookieParser = require('cookie-parser');
  var csrf = require('csurf');
  var bodyParser = require('body-parser');

  const app = await NestFactory.create(AppModule); //,{cors:true}


  app.use(helmet());
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(csrf({ cookie: true }))
  

  app.use('*', function (req, res,next) {
    res.cookie( 'XSRF-TOKEN', req.csrfToken() )
    next()
  })

  app.connectMicroservice({
    transport : Transport.REDIS,
      options : {
        // host : '127.0.0.1',
        // port : 8877,
        url: 'redis://localhost:6379',
      },
  }
  )

  const options = new DocumentBuilder()
    .setTitle('Task Manager')
    .setDescription('The Task-Manager API description')
    .setVersion('1.0')
    .addTag("API's ")
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  await app.startAllMicroservicesAsync();
  
  

  app.use(helmet());
  //app.enableCors();
  

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
  const port = 3000

  // adding websocket adapter
  //app.useWebSocketAdapter(new WsAdapter(app) as any);
  const server = await app.listen(port);
  var io = require('socket.io').listen(server);
  
  logger.log(`Application Listening on port ${ port }`)
}
bootstrap();
