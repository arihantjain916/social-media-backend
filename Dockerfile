FROM node:slim
COPY . /social-media-backend
WORKDIR /social-media-backend
RUN npm install
EXPOSE 4000
CMD npm run dev
ENV [PORT:8000, JWT_SECRET : "salvdnajds;vnjadnvonsdonvlsdnvsdn", MONGO_URI : "mongodb+srv://arihant:FzCvjjm3v9kRf89V@cluster0.refixac.mongodb.net/social-media?retryWrites=true&w=majority"]