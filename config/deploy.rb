require "bundler/capistrano"

set :application, "blog"
set :repository,  "git@github.com:wyeworks/#{application}.git"
set :branch, 'master'
set :user, 'wye'
set :deploy_to, "/var/www/app/#{application}"
set :scm, :git
set :keep_releases, 1
set :deploy_via, :remote_cache
set :default_environment, {
  'RBENV_ROOT' => '/usr/local/rbenv',
  'PATH' => "/usr/local/rbenv/shims:/usr/local/rbenv/bin:$PATH"
}

ssh_options[:forward_agent] = true
server "wyeworks.com", :app, :web, :db, :primary => true

after "deploy:update", "deploy:update_jekyll"
after "deploy:restart", "deploy:cleanup"

namespace :deploy do
  task :start do ; end
  task :stop do ; end
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "touch #{File.join(current_path,'tmp','restart.txt')}"
  end

  desc 'Run jekyll to re-generate site'
  task :update_jekyll do
    run "cd #{current_path} && rm -rf _site/* && bundle exec jekyll"
  end
end
