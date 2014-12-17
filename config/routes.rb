Rails.application.routes.draw do
  root "home#index"

  get '/auth/:provider/callback', to: 'sessions#create'
  get 'logout' => "sessions#destroy"


  resources :teachers do
    resources :courses
  end

  resources :courses do
    resources :lessons
    resources :attendances, only: [:index]
    resources :materials, only: [:show], constraints: { id: /.+/ }
    resources :students
    member do
      get 'grant_access/:access_code' => 'courses#grant_access', as: :grant_access
    end
  end

  resources :lessons do
    resources :materials, only: [:index]
    resources :feedbacks
    member do
      get 'attendances' => 'attendances#attendances'
    end
  end
  resources :attendances

  resources :feedbacks
  resources :students, only: [:index] do
    resources :courses
    resources :lessons do
      member do
        get 'feedback' => 'feedbacks#show'
      end
    end
  end

  resources :users do
    member do
      put 'website' => 'website#sync'
    end
  end

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
