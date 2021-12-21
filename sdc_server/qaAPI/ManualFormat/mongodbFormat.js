

//created indexes on all id fields of all the three collections

db.Answer.updateMany({},{ $rename: { "helpful": "helpfulness" } } )

db.Answer.updateMany({},{ $rename: { "date_written": "date" } } )

db.Question.updateMany({}, { $rename: { "id": "question_id" } })


db.Question.updateMany({}, { $rename: { "date_written": "question_date" } })

db.Question.updateMany({}, { $rename: { "helpful":"question_helpfulness"}})

db.Question.updateMany({}, { $rename: { "body":"question_body"}})
