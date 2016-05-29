class AddRawEmails < ActiveRecord::Migration
  def change
    create_table :raw_emails do |t|
      t.string :from
      t.string :company
      t.text :subject
      t.text :raw_text
      t.text :raw_html
      t.timestamps
    end
  end
end
