jest.mock("googleapis");
jest.mock("./preferences");

JSON.parse = jest.fn().mockImplementation(() => ({}));

describe("getCalendars", () => {
  let getCalendars;

  beforeEach(() => {
    const db = {};
    const oAuth2Client = {};
    getCalendars = require("./gcalendar")(db, oAuth2Client).getCalendars;
  });

  test("resolves", () => {
    return getCalendars().then((calendars) => {
      expect(calendars).toBeDefined();
    });
  });
});

describe("getFreeSlots", () => {
  let getFreeSlots;

  beforeEach(() => {
    const db = {};
    const oAuth2Client = {};
    getFreeSlots = require("./gcalendar")(db, oAuth2Client).getFreeSlots;
  });

  test("resolves", () => {
    return getFreeSlots().then((slots) => {
      expect(slots).toBeDefined();
    });
  });

  test("rejects", () => {
    return getFreeSlots().catch((error) => {
      expect(error).toBeDefined();
    });
  });
});

describe("createEvent", () => {
  let createEvent;

  beforeEach(() => {
    const db = {};
    const oAuth2Client = {};
    createEvent = require("./gcalendar")(db, oAuth2Client).createEvent;
  });

  test("resolves", () => {
    const event = {
      summary: "Test event",
      start: {
        dateTime: "2020-04-07T10:00:00+02:00",
      },
      end: {
        dateTime: "2020-04-07T11:00:00+02:00",
      },
    };

    return createEvent(event).then((slots) => {
      expect(slots).toBeDefined();
    });
  });

  test("rejects with wrong parameters", () => {
    return createEvent({}).catch((error) => {
      expect(error).toBeDefined();
    });
  });
});

describe("getBusySlotsByCalendarId", () => {
  let getBusySlotsByCalendarId;

  beforeEach(() => {
    const db = {};
    const oAuth2Client = {};
    getBusySlotsByCalendarId = require("./gcalendar")(db, oAuth2Client).getBusySlotsByCalendarId;
  });

  test("resolves", () => {
    return getBusySlotsByCalendarId("", "", "primary").then((slots) => {
      expect(slots).toBeDefined();
    });
  });

  test("rejects with wrong parameters", () => {
    return getBusySlotsByCalendarId("", "").catch((error) => {
      expect(error).toBeDefined();
    });
  });
});

describe("getNextEvents", () => {
  let getNextEvents;

  beforeEach(() => {
    const db = {};
    const oAuth2Client = {};
    getNextEvents = require("./gcalendar")(db, oAuth2Client).getNextEvents;
  });

  test("resolves", () => {
    return getNextEvents("primary").then((slots) => {
      expect(slots).toBeDefined();
    });
  });

  test("rejects with wrong parameters", () => {
    return getNextEvents().catch((error) => {
      expect(error).toBeDefined();
    });
  });
});
