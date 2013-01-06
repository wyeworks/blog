set :branch, 'master'
set :user, 'wye'
set :deploy_to, "/var/www/blog.wyeworks.com"
set :keep_releases, 3

server "wyeworks.com", :app, :web, :db, :primary => true

after "deploy:update", "deploy:update_jekyll"
after "deploy:restart", "deploy:cleanup"

namespace :deploy do
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "touch #{File.join(current_path,'tmp','restart.txt')}"
  end

  desc 'Run jekyll to re-generate site'
  task :update_jekyll do
    run "cd #{current_path} && rm -rf _site/* && #{bundle_cmd} exec jekyll"
  end
end
