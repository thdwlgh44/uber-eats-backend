import { Test } from "@nestjs/testing";
import { UserService } from "./users.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./entites/user.entity";
import { verify } from "crypto";
import { JwtService } from "src/jwt/jwt.service";

const mockRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
};

const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
}

describe("UserService", () => {

    let service: UserService;

    beforeAll(async () => {

        const module = await Test.createTestingModule({
            providers: [UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockRepository,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();
        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    })

    it.todo('createAccount');
    it.todo('login');
    it.todo('findById');
    it.todo('editProfile');
})