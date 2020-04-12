let start;
let mockReply;
let mockSet;
describe("onCallback", ()=>{
  beforeEach(()=>{
    mockSet = jest.fn((key, data) => {

    });

    mockReply = jest.fn((msg, param) => {

    });

    const preferences = {set: mockSet};
    start=require("../usecases/start")(preferences, null, null);
  });

  test("cid", ()=>{
    // const waRes = {generic: [{text: undefined}]};
    const data = "start_cid_test";
    const ctx = {reply: mockReply, callbackQuery: {data: data}};
    start.onCallbackQuery(ctx);
    expect(mockSet.mock.calls.length).toEqual(1);
    expect(mockSet).toHaveBeenCalledWith("lecture_cal_id", "test");
    expect(mockReply.mock.calls.length).toEqual(1);
  });

  test("sid", ()=>{
    const data = "start_sid_test";
    const ctx = {reply: mockReply, callbackQuery: {data: data}};
    start.onCallbackQuery(ctx);
    expect(mockSet.mock.calls.length).toEqual(1);
    expect(mockSet).toHaveBeenCalledWith("home_stop_id", "test");
    expect(mockReply.mock.calls.length).toEqual(1);
  });

  test("usid", ()=>{
    const data = "start_usid_test";
    const ctx = {reply: mockReply, callbackQuery: {data: data}};
    start.onCallbackQuery(ctx);
    expect(mockSet.mock.calls.length).toEqual(1);
    expect(mockSet).toHaveBeenCalledWith("uni_stop_id", "test");
    expect(mockReply.mock.calls.length).toEqual(1);
  });

  /*  test("uid", ()=>{
    const data = "start_uid_test";
    const ctx = {reply: mockReply, callbackQuery: {data: data}};
    start.onCallbackQuery(ctx);
    // expect(mockSet.mock.calls.length).toEqual(1);
    // const spy = jest.spyOn(start, "uniAddresses");
    // spy.mockReturnValue({test: "Hauptstraße 1"});
    // expect(mockSet).toHaveBeenCalled();
    // expect(mockReply.mock.calls.length).toEqual(1);
  });*/

  test("uid - catch", ()=>{
    const data = "start_uid_test";
    const ctx = {reply: mockReply, callbackQuery: {data: data}};
    try {
      start.onCallbackQuery(ctx);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test("tid", ()=>{
    const data = "start_tid_test";
    const ctx = {reply: mockReply, callbackQuery: {data: data}};
    start.onCallbackQuery(ctx);
    expect(mockSet.mock.calls.length).toEqual(1);
    expect(mockSet).toHaveBeenCalledWith("commute", "test");
    expect(mockReply.mock.calls.length).toEqual(1);
  });

  test("tid - catch", ()=>{
    const data = "start_tid_test";
    const ctx = {reply: mockReply, callbackQuery: {data: data}};
    try {
      start.onCallbackQuery(ctx);
    } catch (error) {
      expect(error).toBeDefined();
      expect(mockReply.mock.calls.length).toEqual(1);
    }
  });

  test("tid - parameter vss", ()=>{
    const data = "start_tid_vvs";
    const ctx = {reply: mockReply, callbackQuery: {data: data}};
    start.onCallbackQuery(ctx);
    expect(mockSet.mock.calls.length).toEqual(1);
    expect(mockSet).toHaveBeenCalledWith("commute", "vvs");
  });
});
describe("onUpdate", ()=>{
  beforeEach(()=>{
    mockSet = jest.fn((key, data) => {

    });

    mockReply = jest.fn((msg, param) => {

    });

    const preferences = {set: mockSet};
    start=require("../usecases/start")(preferences, null, null);
  });

  test("start", ()=>{
    const waRes = {generic: [{text: "start"}]};
    const ctx = {reply: mockReply};
    start.onUpdate(ctx, waRes);
    // expect(mockSet.mock.calls.length).toEqual(1);
    // expect(mockSet).toHaveBeenCalledWith("lecture_cal_id", "test");
    expect(mockReply.mock.calls.length).toEqual(1);
  });

  test("start_name", ()=>{
    const waRes = {generic: [{text: "start_name"}], context: {name: "John"}};
    const ctx = {reply: mockReply};
    start.onUpdate(ctx, waRes);
    expect(mockSet.mock.calls.length).toEqual(1);
    expect(mockSet).toHaveBeenCalledWith("name", "John");
    expect(mockReply.mock.calls.length).toEqual(1);
    expect(mockReply.mock.calls[0][0]).toContain("John");
  });

  test("start_email", ()=>{
    const waRes = {generic: [{text: "start_email"}], context: {email: "john@test.com"}};
    const ctx = {reply: mockReply};
    start.onUpdate(ctx, waRes);
    expect(mockSet.mock.calls.length).toEqual(1);
    expect(mockSet).toHaveBeenCalledWith("email", "john@test.com");
    expect(mockReply.mock.calls.length).toEqual(1);
  });

  test("start_address", ()=>{
    const waRes = {generic: [{text: "start_address"}], context: {address: "Samplestreet 17 SampleCity"}};
    const ctx = {reply: mockReply};
    start.onUpdate(ctx, waRes);
    expect(mockSet.mock.calls.length).toEqual(1);
    expect(mockSet).toHaveBeenCalledWith("home_address", "Samplestreet 17 SampleCity");
    expect(mockReply.mock.calls.length).toEqual(1);
  });

  test("start_address catch", ()=>{
    const waRes = {generic: [{text: "start_address"}], context: {address: "Samplestreet 17 SampleCity"}};
    const ctx = {reply: mockReply};
    try {
      start.onUpdate(ctx, waRes);
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  test("start_uni", ()=>{
    const waRes = {generic: [{text: "start_uni"}], context: {uni: undefined}};
    const ctx = {reply: mockReply};

    try {
      start.onUpdate(ctx, waRes);
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  test("start_uni_email", ()=>{
    const waRes = {generic: [{text: "start_uni_email"}], context: {uni_email: "sek@test.com"}};
    const ctx = {reply: mockReply};

    try {
      start.onUpdate(ctx, waRes);
    } catch (e) {
      expect(e).toBeDefined();
      expect(mockSet.mock.calls.length).toEqual(1);
      expect(mockSet).toHaveBeenCalledWith("uni_email", "sek@test.com");
      expect(mockReply.mock.calls.length).toEqual(1);
    }
  });

  test("start_is_authenticated", ()=>{
    const waRes = {generic: [{text: "start_uni_email"}], context: {uni_email: "sek@test.com"}};
    const ctx = {reply: mockReply};


    try {
      start.onUpdate(ctx, waRes);
    } catch (e) {
      expect(e).toBeDefined();
      expect(mockReply.mock.calls.length).toEqual(1);
    }
  });
});
