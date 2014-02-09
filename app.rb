require 'sinatra'

if development?
  require 'sinatra/reloader'
end

get '/' do
  @page = 'work'
  erb :index
end

get '/index' do
  redirect '/'
end

get '/about' do
  @page = 'about'
  erb :about
end

get '/SolairPlmUX' do
  @page = 'work'
  erb :SolairPlmUX
end

get '/linkedin' do
  @page = 'work'
  erb :linkedin
end

get '/SolairSite' do
  @page = 'work'
  erb :SolairSite
end

get '/truespirit' do
  @page = 'work'
  erb :truespirit
end

get '/iphoneapp' do
  @page = 'work'
  erb :iphoneapp
end