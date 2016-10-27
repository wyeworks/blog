# config valid only for current version of Capistrano
lock '3.6.1'

set :application, 'blog'
set :repo_url, 'git@github.com:wyeworks/blog.git'
set :deploy_to, '/usr/local/www/wyeworks.com'
set :keep_releases, 2
server 'wyeworks.com', roles: [:web], user: 'deploy'

namespace :deploy do
  task :update_jekyll do
    on roles(:all) do
      within "#{deploy_to}/current" do
        execute :compass, :compile, "--css-dir source/stylesheets"
        execute :jekyll, :build
        execute :gulp
      end
    end
  end

end

after "deploy:symlink:release", "deploy:update_jekyll"
