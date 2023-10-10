import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { AdminService } from 'src/admin/admin.service';
import { UsersService } from 'src/users/users.service';

const cron = require('node-cron');

const TelegramBot = require('node-telegram-bot-api');

@Injectable()
export class TelegramService {
  private bot: any;

  private logger = new Logger(TelegramService.name);

  constructor(
    private readonly usersService: UsersService,
    private adminService: AdminService,
  ) {
    this.initialApi();

    // Function for send daily updated on weather to all subscribed users
    cron.schedule('0 0 * * *', async () => {
      const allusers = await this.usersService.findAll();

      allusers.map(async (user) => {
        if (user.status === 'subscribe') {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${user.city}&appid=001d58fdfa81ffc30270b628b3cd500d`,
          );

          const data = response.data;
          const weather = data.weather[0].description;
          const temperature = data.main.temp - 273.15;
          const city = data.name;
          const humidity = data.main.humidity;
          const pressure = data.main.pressure;
          const windSpeed = data.wind.speed;
          const message = `The weather in ${city} is ${weather} with a temperature of ${temperature.toFixed(
            2,
          )}C. The humidity is ${humidity}%, the pressure is ${pressure}hpa, and the wind speed is ${windSpeed}m/s.`;
          this.bot.sendMessage(user.chat_id, message);
        }
      });
    });
  }

  // Initial Api
  initialApi = () => {
    if (this.bot) {
      this.bot.stopPolling();
    }
    this.adminService
      .findOne(1)
      .then((res) => {
        this.bot = new TelegramBot(res.apikey, { polling: true });
        this.bot.on('message', this.sendMessageToUser);
      })
      .catch((err) => console.log(err));
  };

  // Set New API After change it
  resetApi = (newApi: string) => {
    this.adminService
      .findOne(1)
      .then((res) => {
        this.bot.stopPolling();
        this.bot = new TelegramBot(newApi, { polling: true });
        this.bot.on('message', this.sendMessageToUser);
      })
      .catch((err) => console.log(err));
  };

  // Function for manage messages
  sendMessageToUser = async (msg: any) => {
    this.logger.debug(msg);
    const userTxt = msg.text;

    // Check the existence
    const isExist = await this.usersService.findOne(msg.chat.id);

    if (userTxt !== '/start') {
      if (userTxt.toLowerCase() !== 'subscribe') {
        if (isExist && isExist.status === 'subscribe') {
          // Exist user search for other city weather
          try {
            const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?q=${userTxt}&appid=001d58fdfa81ffc30270b628b3cd500d`,
            );
            const data = response.data;
            const weather = data.weather[0].description;
            const temperature = data.main.temp - 273.15;
            const city = data.name;
            const humidity = data.main.humidity;
            const pressure = data.main.pressure;
            const windSpeed = data.wind.speed;
            const message = `The weather in ${city} is ${weather} with a temperature of ${temperature.toFixed(
              2,
            )}C. The humidity is ${humidity}%, the pressure is ${pressure}hpa, and the wind speed is ${windSpeed}m/s.`;
            this.bot.sendMessage(msg.chat.id, message);
          } catch (error) {
            this.bot.sendMessage(msg.chat.id, 'City does not exists');
          }
        }
        // If user is blocked send this message
        else if (isExist && isExist.status === 'block') {
          this.bot.sendMessage(
            msg.chat.id,
            "You are block for some reasons so you don't have any access",
          );
        }
        // If User exists but not subscribed
        else if (isExist) {
          // Send the weather update when user enter city for subscribe and at that time we store the value into databse
          try {
            const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?q=${userTxt}&appid=001d58fdfa81ffc30270b628b3cd500d`,
            );
            const data = response.data;
            const weather = data.weather[0].description;
            const temperature = data.main.temp - 273.15;
            const city = data.name;
            const humidity = data.main.humidity;
            const pressure = data.main.pressure;
            const windSpeed = data.wind.speed;
            const message = `The weather in ${city} is ${weather} with a temperature of ${temperature.toFixed(
              2,
            )}C. The humidity is ${humidity}%, the pressure is ${pressure}hpa, and the wind speed is ${windSpeed}m/s.`;
            this.bot.sendMessage(msg.chat.id, message);

            // Update a user in the database
            await this.usersService.update(isExist.id, {
              city: userTxt,
              status: 'subscribe',
            });
          } catch (error) {
            // Send the failure message
            this.bot.sendMessage(msg.chat.id, 'City does not exists');
          }
        }
        // If user want to search the weather by entering the name of city and without subscribe
        else {
          try {
            const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?q=${userTxt}&appid=001d58fdfa81ffc30270b628b3cd500d`,
            );
            const data = response.data;
            const weather = data.weather[0].description;
            const temperature = data.main.temp - 273.15;
            const city = data.name;
            const humidity = data.main.humidity;
            const pressure = data.main.pressure;
            const windSpeed = data.wind.speed;
            const message = `The weather in ${city} is ${weather} with a temperature of ${temperature.toFixed(
              2,
            )}C. The humidity is ${humidity}%, the pressure is ${pressure}hpa, and the wind speed is ${windSpeed}m/s.`;
            this.bot.sendMessage(msg.chat.id, message);
          } catch (error) {
            this.bot.sendMessage(msg.chat.id, 'City does not exists');
          }
        }
      }
      // When user want to subscribe
      else {
        this.bot.sendMessage(msg.chat.id, 'Enter the City name');
        if (!isExist) {
          // Create a user in the database
          await this.usersService.create({
            chat_id: msg.chat.id,
            status: 'pending subscription',
          });
        }
      }
    } else {
      // If already exist user press "start" after long time then we give the weather update of that city which he have entered on the time of subscribe
      if (isExist && isExist.status === 'subscribe') {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${isExist.city}&appid=001d58fdfa81ffc30270b628b3cd500d`,
          );
          const data = response.data;
          const weather = data.weather[0].description;
          const temperature = data.main.temp - 273.15;
          const city = data.name;
          const humidity = data.main.humidity;
          const pressure = data.main.pressure;
          const windSpeed = data.wind.speed;
          const message = `The weather in ${city} is ${weather} with a temperature of ${temperature.toFixed(
            2,
          )}C. The humidity is ${humidity}%, the pressure is ${pressure}hpa, and the wind speed is ${windSpeed}m/s.`;
          this.bot.sendMessage(msg.chat.id, message);
        } catch (error) {
          this.bot.sendMessage(msg.chat.id, "City doesn't exist.");
        }
      }
      // If user is blocked send this message
      else if (isExist && isExist.status === 'block') {
        this.bot.sendMessage(
          msg.chat.id,
          "You are block for some reasons so you don't have any access",
        );
      }
      // When user is new
      else {
        // Send the subscribe message
        this.bot.sendMessage(
          msg.chat.id,
          `Hello ${msg.chat.first_name} !! Please subscribe to get daily update on weather (Type subscribe).`,
        );
      }
    }
  };
}
