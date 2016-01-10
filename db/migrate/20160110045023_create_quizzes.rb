class CreateQuizzes < ActiveRecord::Migration
  def change
    create_table :quizzes do |t|
      t.references :concept
      t.text :question
      t.text :choices, array: true, default: []
    end
  end
end
