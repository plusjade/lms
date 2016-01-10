class AddTables < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string    :email
      t.string    :name
      t.string    :avatar
      t.string    :uid
      t.string    :provider
      t.string    :token
      t.string    :type
      t.timestamps null: false
    end

    create_table :courses do |t|
      t.string     :name
      t.string     :slug
      t.string     :access_code
      t.string     :calendar_embed
      t.timestamps null: false
    end

    create_table :courses_users, id: false do |t|
      t.belongs_to :course, index: true
      t.belongs_to :user, index: true
    end

    create_table :lessons do |t|
      t.string        :title
      t.datetime      :date
      t.float         :lesson
      t.integer       :week

      t.belongs_to :course, index: true

      t.timestamps null: false
    end

    create_table :feedbacks do |t|
      t.integer    :comprehension
      t.integer    :engagement
      t.integer    :quality
      t.integer    :pace

      t.text      :learned
      t.text      :comments
      t.text      :questions

      t.belongs_to :user
      t.belongs_to :lesson

      t.timestamps null: false
    end

    create_table :attendances do |t|
      t.boolean       :attended, default: false
      t.boolean       :excused, default: false
      t.string        :reason

      t.belongs_to :user
      t.belongs_to :lesson
      t.belongs_to :course

      t.timestamps null: false
    end
  end
end
