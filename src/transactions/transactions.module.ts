import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TransactionsRepository } from './transactions.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AccountRepository } from 'src/accounts/accounts.repository';

@Module({
  imports: [PrismaModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsRepository, AccountRepository],
})
export class TransactionsModule {}
