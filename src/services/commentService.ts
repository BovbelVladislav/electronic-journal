import { AppDataSource } from '../database/data-source';
import { Comment } from '../entities/Comment';
import { Submission } from '../entities/Submission';
import { User } from '../entities/User';

export const addComment = async (submissionId: number, authorId: number, content: string) => {
  const submissionRepo = AppDataSource.getRepository(Submission);
  const userRepo = AppDataSource.getRepository(User);
  const commentRepo = AppDataSource.getRepository(Comment);

  const submission = await submissionRepo.findOneBy({ id: submissionId });
  if (!submission) throw new Error('Submission not found');

  const author = await userRepo.findOneBy({ id: authorId });
  if (!author) throw new Error('Author not found');

  const comment = commentRepo.create({
    submission,
    author,
    content
  });

  return commentRepo.save(comment);
};
