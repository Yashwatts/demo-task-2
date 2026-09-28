import { User } from 'src/domain/user.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/domain/enums/user-role.enum';

export default class AdminSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const adminEmail = process.env.ADMIN_EMAIL;

    const existingAdmin = await userRepository.findOne({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      const adminUser = userRepository.create({
        username: 'admin',
        email: adminEmail,
        password: hashedPassword,
        role: UserRole.ADMIN,
      });
      await userRepository.save(adminUser);
      console.log('Seeded Admin Account Successfully:', adminEmail);
    }
  }
}
