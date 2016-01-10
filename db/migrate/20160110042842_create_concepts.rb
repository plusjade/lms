class CreateConcepts < ActiveRecord::Migration
  def change
    create_table :concepts do |t|
      t.string    :slug
    end
  end
end
