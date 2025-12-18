import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/index-browser';
import { AccountRepository } from 'src/accounts/accounts.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accountsRepo: AccountRepository,
  ) {}

  async deposit(userId: number, accountId: number, amount: number) {
    const account = await this.accountsRepo.findUserAccount(userId, accountId);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const newBalance = account.balance.add(new Decimal(amount));

    await this.accountsRepo.updateUserAccount(userId, accountId, {
      balance: newBalance.toNumber(),
    });

    return await this.prisma.transaction.create({
      data: {
        accountId,
        amount: new Decimal(amount),
        type: 'DEPOSIT',
      },
    });
  }

  async withdraw(userId: number, accountId: number, amount: number) {
    const account = this.accountsRepo.findUserAccount(userId, accountId);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if ((await account).balance.lessThan(amount)) {
      throw new NotFoundException('Insufficient funds');
    }

    const newBalance = (await account).balance.sub(new Decimal(amount));

    await this.accountsRepo.updateUserAccount(userId, accountId, {
      balance: newBalance.toNumber(),
    });

    return await this.prisma.transaction.create({
      data: {
        accountId,
        amount: new Decimal(amount),
        type: 'WITHDRAW',
      },
    });
  }

  async tranfer(
    userId: number,
    accountId: number,
    amount: number,
    targetAccountId: number,
  ) {
    if (accountId === targetAccountId)
      return new BadRequestException('Cannot transfer to the same account');

    const fromAccount = await this.accountsRepo.findUserAccount(
      userId,
      accountId,
    );
    if (!fromAccount) return new NotFoundException('Account not found');
    if (fromAccount.balance.lessThan(amount))
      return new BadRequestException('Insufficient funds');

    const toAccount = await this.accountsRepo.findUserAccount(
      userId,
      targetAccountId,
    );
    if (!toAccount) return new NotFoundException('Account not found');

    const newBalance = fromAccount.balance.sub(new Decimal(amount));

    //update from account
    await this.accountsRepo.update(accountId, {
      balance: newBalance.toNumber(),
    });

    //update target account
    await this.accountsRepo.update(targetAccountId, {
      balance: toAccount.balance.add(new Decimal(amount)).toNumber(),
    });

    return await this.prisma.transaction.create({
      data: {
        accountId,
        targetAccountId,
        amount: new Decimal(amount),
        type: 'TRANFER',
      },
    });
  }

  async findAllByUser(userId: number) {
    return await this.prisma.transaction.findMany({
      where: {
        account: {
          userId,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneByUser(userId: number, transactionId: number) {
    return await this.prisma.transaction.findUnique({
      where: {
        id: transactionId,
        account: {
          userId,
        },
      },
    });
  }
}
