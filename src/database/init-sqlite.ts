import AppDataSource from './data-source';
import bcrypt from 'bcryptjs';
import { User } from '../entities/User';
import { Group } from '../entities/Group';
import { Subject } from '../entities/Subject';

async function init() {
  const ds = AppDataSource;
  await ds.initialize();
  console.log('SQLite DB initialized at', ds.options.database);

  const userRepo = ds.getRepository(User);
  const groupRepo = ds.getRepository(Group);
  const subjectRepo = ds.getRepository(Subject);

  const passwordHash = await bcrypt.hash('password123', 10);

  await userRepo.save([
    userRepo.create({ email: 'teacher1@example.com', password_hash: passwordHash, first_name: 'Teacher', last_name: 'One', role: 'teacher' }),
    userRepo.create({ email: 'student1@example.com', password_hash: passwordHash, first_name: 'Student', last_name: 'One', role: 'student' })
  ]);

  await groupRepo.save(groupRepo.create({ name: 'Group A', description: 'Seed group A' }));

  await subjectRepo.save(subjectRepo.create({ name: 'Mathematics', description: 'Basic math' }));

  console.log('Seed finished.');
  await ds.destroy();
}

init().catch(err => {
  console.error('Init failed', err);
  process.exit(1);
});
