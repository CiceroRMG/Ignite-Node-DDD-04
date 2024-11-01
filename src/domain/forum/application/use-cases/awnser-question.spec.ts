import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { AnswerQuestionUseCase } from './awnser-question'

const fakeAwnsersRepository: AnswersRepository = {
  create: async (answer: Answer) => {},
}

test('create an anwser', async () => {
  const answerQuestion = new AnswerQuestionUseCase(fakeAwnsersRepository)

  const answer = await answerQuestion.execute({
    questionId: '1',
    instructorId: '1',
    content: 'Nova resposta',
  })

  expect(answer.content).toEqual('Nova resposta')
})
