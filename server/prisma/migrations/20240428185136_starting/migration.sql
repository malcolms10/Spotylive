-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,
    "following" INTEGER NOT NULL,
    "admin" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "about" TEXT
);

-- CreateTable
CREATE TABLE "Midia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "editora" TEXT,
    "compositor" TEXT,
    "grupo" TEXT,
    "periodo" TEXT,
    "historia" TEXT,
    "capa" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Midia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "coment" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "midiaId" TEXT NOT NULL,
    CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_midiaId_fkey" FOREIGN KEY ("midiaId") REFERENCES "Midia" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "visibility" TEXT NOT NULL,
    CONSTRAINT "Playlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_MidiaToPlaylist" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_MidiaToPlaylist_A_fkey" FOREIGN KEY ("A") REFERENCES "Midia" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MidiaToPlaylist_B_fkey" FOREIGN KEY ("B") REFERENCES "Playlist" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Midia_titulo_key" ON "Midia"("titulo");

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_nome_key" ON "Playlist"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "_MidiaToPlaylist_AB_unique" ON "_MidiaToPlaylist"("A", "B");

-- CreateIndex
CREATE INDEX "_MidiaToPlaylist_B_index" ON "_MidiaToPlaylist"("B");
