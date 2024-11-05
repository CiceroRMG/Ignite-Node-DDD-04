import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from './../../../../../test/repositories/in-memory-answers-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { makeQuestion } from 'test/factories/make-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository,
    )
  })

  it('should be able to choose question best answer', async () => {
    const newQuestion = makeQuestion()

    const newAnswer = makeAnswer({
      questionId: newQuestion.id,
    })

    await inMemoryAnswersRepository.create(newAnswer)
    await inMemoryQuestionsRepository.create(newQuestion)

    await sut.execute({
      authorId: newQuestion.authorId.toString(),
      answerId: newAnswer.id.toString(),
    })

    expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(
      newAnswer.id,
    )
  })

  it('should not be able to choose question best answer from another user', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityID('author-1'),
    })

    const newAnswer = makeAnswer({
      questionId: newQuestion.id,
    })

    await inMemoryAnswersRepository.create(newAnswer)
    await inMemoryQuestionsRepository.create(newQuestion)

    expect(async () => {
      await sut.execute({
        authorId: 'author-2',
        answerId: newAnswer.id.toString(),
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
