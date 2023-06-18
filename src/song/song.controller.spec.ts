import { Test, TestingModule } from "@nestjs/testing";
import { SongController } from "./song.controller";
import { SongService } from "./song.service";

describe("SongController", () => {
  let controller: SongController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongController],
      providers: [SongService],
    }).compile();

    controller = module.get<SongController>(SongController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
