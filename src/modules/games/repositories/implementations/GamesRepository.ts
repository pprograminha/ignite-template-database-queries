import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = await this.repository
                    .createQueryBuilder()
                    .select('games')
                    .from(Game, 'games')
                    .where("LOWER(games.title) LIKE LOWER(:title)", { title:`%${param}%` })
                    .getMany();

    return games
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query('SELECT COUNT(*) FROM games'); 
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return await this.repository
      .createQueryBuilder()
      .relation(Game, "users")
      .of(id)
      .loadMany();
  }
}
