const Markup = require("telegraf/markup");
const vvs = require("../services/vvs/vvs.js")();
const gplaces = require("../services/gplaces")();
module.exports = (preferences, db, oAuth2Client) => {
  let commutePreference;
  let homeAddress;
  this._homeAddresses;
  let uniAddresses;
  this._setHomeAddress=(promise, ctx)=>{
    promise.then((data) => {
      if (data.results.length > 1) {
        const addressButtons = data.results.map((result) => {
          // drop ", Germany"
          const address = result.formatted_address.split(", ").slice(0, -1).join(", ");
          const location = result.geometry.location;
          const coordinates = location.lat + ", " + location.lng;
          this._homeAddresses[result.place_id] = {address: address, location: coordinates};
          return [Markup.callbackButton(address, "start_addr_" + result.place_id)];
        });

        ctx.reply("Wähle deine Adresse aus:", Markup.inlineKeyboard(addressButtons).extra());
      } else {
        const address = data.results[0].formatted_address.split(", ").slice(0, -1).join(", ");
        homeAddress = address;
        preferences.set("home_address", address);
        const location = data.results[0].geometry.location;
        const coordinates = location.lat + ", " + location.lng;
        preferences.set("home_address_coordinates", coordinates);
        this._chooseTravelMethod(ctx);
      }
    },
    ).catch((err) => {
      ctx.reply("Sorry, die Adresse wurde nicht gefunden. Starte den Prozess neu mit \"start\"");
      console.log(err);
    });
  };
  this._chooseTravelMethod=(ctx)=>{
    // set travel method
    const travelMethods = [
      {displayName: "Laufen", value: "walking"},
      {displayName: "Auto", value: "driving"},
      {displayName: "Fahrrad", value: "bicycling"},
      {displayName: "ÖPNV", value: "vvs"},
    ];

    const travelMethodButtons = travelMethods.map((method) => {
      return [Markup.callbackButton(method.displayName, "start_tid_" + method.value)];
    });
    ctx.reply("Wähle deine bevorzugte Reisemöglichkeit aus:", Markup.inlineKeyboard(travelMethodButtons).extra());
  };
  const cal = require("../services/gcalendar")(db, oAuth2Client);
  this.onUpdate = (ctx, waRes) => {
    // console.log("use case", waRes.generic[0].text);

    // debug: reply with identifier
    // ctx.reply(waRes.generic[0].text);

    // const response = waRes.context.name;
    // console.log("Antwort", response);

    switch (waRes.generic[0].text) {
      case "start":
        ctx.reply("Hallo ich bin James!\n" +
            "Erzähl mir doch ein bisschen was über dich.\n" +
            "Wie heißt du?");
        break;

      case "start_name":
        preferences.set("name", waRes.context.name);
        ctx.reply("Hallo " + waRes.context.name + "\n" +
            "Sag mir deine Email");
        break;

      case "start_email":
        preferences.set("email", waRes.context.email);
        ctx.reply("Sag mir deine Adresse");
        break;

      case "start_address":
        // preferences.set("home_address", waRes.context.address);
        // homeAddress = waRes.context.address;

        this._homeAddresses=[];
        this._setHomeAddress(gplaces.getPlaces({query: waRes.context.address}), ctx);
        /* gplaces.getPlaces({query: waRes.context.address}).then((data) => {
          if (data.results.length>1) {
            const addressButtons = data.results.map((result)=>{
            // drop ", Germany"
              const address = result.formatted_address.split(", ").slice(0, -1).join(", ");
              const location = result.geometry.location;
              const coordinates = location.lat + ", " + location.lng;
              this._homeAddresses[result.place_id] = {address: address, location: coordinates};
              return [Markup.callbackButton(address, "start_addr_" + result.place_id)];
            });

            ctx.reply("Wähle deine Adresse aus:", Markup.inlineKeyboard(addressButtons).extra());
          } else {
            const address = data.results[0].formatted_address.split(", ").slice(0, -1).join(", ");
            homeAddress=address;
            preferences.set("home_address", address);
            const location = data.results[0].geometry.location;
            const coordinates = location.lat + ", " + location.lng;
            preferences.set("home_address_coordinates", coordinates);
            this._chooseTravelMethod(ctx);
          }*/
        /*   // save location
          console.log(data.results);
          const location = data.results[0].geometry.location;
          const coordinates = location.lat + ", " + location.lng;*/
        // }).catch((err) => {
        //   ctx.reply("Sorry, die Adresse wurde nicht gefunden. Starte den Prozess neu mit \"start\"");
        //   console.log(err);
        // });

        break;

      case "start_uni":
        gplaces.getPlaces({query: waRes.context.uni}).then((data) => {
          const location = data.results;

          uniAddresses = [];

          const uniButtons = location.map((uni) => {
            // drop ", Germany"
            const address = uni.formatted_address.split(", ").slice(0, -1).join(", ");
            uniAddresses[uni.place_id] = {address: address};
            console.log("full uni address", uni.formatted_address);
            console.log("uni address", address);
            return [Markup.callbackButton(address, "start_uid_" + uni.place_id)];
          });
          console.log("uni location", location);
          ctx.reply("Wähle deine Uni aus:", Markup.inlineKeyboard(uniButtons).extra());
        }).catch((err) => {
          console.log(err);
        });
        break;

      case "start_uni_email":
        preferences.set("uni_email", waRes.context.uni_email);

        ctx.reply("Jetzt richten wir deinen Kalender ein. Bitte authentifiziere dich mit diesem Link:");
        cal.authenticateUser(ctx);
        break;

      case "start_is_authenticated":
        cal.getCalendars().then((cals) => {
          const buttons = cals.map((resCal) => [Markup.callbackButton(resCal.summary, "start_cid_" + resCal.id)]);
          ctx.reply("Wähle deinen Vorlesungskalender aus:", Markup.inlineKeyboard(buttons).extra());
        }).catch((err) => {
          ctx.reply("Sorry, es gab einen Fehler!");
        });
        break;
    }
  };
  this.onCallbackQuery = (ctx) => {
    // remove "start_" prefix
    const buttonData = ctx.callbackQuery.data.split("_").slice(1).join("_");
    const indicator = buttonData.split("_")[0];
    const data = buttonData.split("_").slice(1).join("_");

    switch (indicator) {
      case "cid": // CALENDAR
        preferences.set("lecture_cal_id", data);
        ctx.reply("Danke! Das war's.");
        break;
      case "sid": // HOME STOP ID
        preferences.set("home_stop_id", data);
        ctx.reply("An welcher Uni/Hochschule bist du?");
        break;

      case "usid": // UNI STOP ID
        preferences.set("uni_stop_id", data);
        ctx.reply("Jetzt sag mir noch die Email Adresse deines Sekretariats");
        break;

      case "uid": // UNI ADDRESS
        const uniAddress = uniAddresses[data].address;
        preferences.set("uni_address", uniAddress);
        if (commutePreference==="vvs") {
          vvs.getStopByKeyword(uniAddress).then((data) => {
            if (Array.isArray(data)) {
              const stopButtons = data.map((stop) => [Markup.callbackButton(stop.name, "start_usid_" + stop.stopID)]);
              ctx.reply("Wähle deine Uni-Haltestelle aus:", Markup.inlineKeyboard(stopButtons).extra());
            } else {
              preferences.set("uni_stop_id", data.stopID);
              ctx.reply(`Ich habe deine Uni-Haltestelle: "${data.name}" gespeichert`);
            }
          }).catch((error) => {
            ctx.reply("Sorry, jetzt gab es ein Problem");
          });
        } else {
          ctx.reply("Jetzt sag mir noch die Email Adresse deines Sekretariats");
        }
        break;

      case "addr": // UNI ADDRESS

        homeAddress = this._homeAddresses[data].address;
        preferences.set("home_address", homeAddress);
        preferences.set("home_address_coordinates", this._homeAddresses[data].location);

        this._chooseTravelMethod(ctx);
        break;

      case "tid": // TRAVEL MODE
        preferences.set("commute", data);
        commutePreference = data;

        if (commutePreference === "vvs") {
          vvs.getStopByKeyword(homeAddress).then((stops) => {
            if (Array.isArray(stops)) {
              const stopButtons = stops.map((stop) => [Markup.callbackButton(stop.name, "start_sid_" + stop.stopID)]);
              ctx.reply("Wähle deine Haltstelle zuhause aus:", Markup.inlineKeyboard(stopButtons).extra());
            } else {
              preferences.set("home_stop", stops.stopID);
              ctx.reply(`Ich habe deine Haltestelle: "${stops.name}" gespeichert\n An welcher Uni/Hochschule bist du?`);
            }
          }).catch((error) => {
            ctx.reply("Sorry, jetzt gab es ein Problem");
          });
        } else {
          ctx.reply("An welcher Uni/Hochschule bist du?");
        }
        break;
    }
  };
  return this;
};
