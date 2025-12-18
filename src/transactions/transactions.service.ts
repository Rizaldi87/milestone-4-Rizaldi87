import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsRepository } from './transactions.repository';

@Injectable()
export class TransactionsService {
  constructor(private readonly repo: TransactionsRepository) {}

  deposit(userId: number, accountId: number, amount: number) {
    return this.repo.deposit(userId, accountId, amount);
  }

  withdraw(userId: number, accountId: number, amount: number) {
    return this.repo.withdraw(userId, accountId, amount);
  }

  tranfer(
    userId: number,
    accountId: number,
    amount: number,
    targetAccountId: number,
  ) {
    return this.repo.tranfer(userId, accountId, amount, targetAccountId);
  }

  findAllByUser(userId: number) {
    return this.repo.findAllByUser(userId);
  }

  findOneByUser(userId: number, id: number) {
    return this.repo.findOneByUser(userId, id);
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
