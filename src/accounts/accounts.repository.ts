import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  //admin
  async findAll() {
    return await this.prisma.account.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.account.findUnique({ where: { id } });
  }

  async create(dto: any) {
    return await this.prisma.account.create({ data: dto });
  }

  async update(id: number, dto: UpdateAccountDto) {
    return await this.prisma.account.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    return await this.prisma.account.delete({ where: { id } });
  }

  //user specific

  async createUserAccount(userId: number, dto: CreateAccountDto) {
    return await this.prisma.account.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findUserAccounts(userId: number) {
    return await this.prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findUserAccount(userId: number, accountId: number) {
    const account = await this.prisma.account.findUnique({
      where: {
        id: accountId,
      },
    });

    if (!account || account.userId !== userId) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async updateUserAccount(
    userId: number,
    accountId: number,
    dto: UpdateAccountDto,
  ) {
    return await this.prisma.account.update({
      where: { id: accountId },
      data: dto,
    });
  }

  async removeUserAccount(userId: number, accountId: number) {
    await this.findUserAccount(userId, accountId);

    return await this.prisma.account.delete({ where: { id: accountId } });
  }
}
