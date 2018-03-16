
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, 2012 and Azure
-- --------------------------------------------------
-- Date Created: 03/06/2018 13:12:51
-- Generated from EDMX file: C:\Users\iazpiroz-ext\documents\visual studio 2015\Projects\KanbanMVC\KanbanMVC\DBContext\KanbanDBEntities.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [KanbanDB];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[FK_cardlist]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[cards] DROP CONSTRAINT [FK_cardlist];
GO
IF OBJECT_ID(N'[dbo].[FK_cardlistsId]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[subcardlist] DROP CONSTRAINT [FK_cardlistsId];
GO
IF OBJECT_ID(N'[dbo].[FK_cardsId]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[tasks] DROP CONSTRAINT [FK_cardsId];
GO
IF OBJECT_ID(N'[dbo].[FK_projectscardlist]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[cardlist] DROP CONSTRAINT [FK_projectscardlist];
GO
IF OBJECT_ID(N'[dbo].[FK_subcardlist]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[cards] DROP CONSTRAINT [FK_subcardlist];
GO

-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[cardlist]', 'U') IS NOT NULL
    DROP TABLE [dbo].[cardlist];
GO
IF OBJECT_ID(N'[dbo].[cards]', 'U') IS NOT NULL
    DROP TABLE [dbo].[cards];
GO
IF OBJECT_ID(N'[dbo].[projects]', 'U') IS NOT NULL
    DROP TABLE [dbo].[projects];
GO
IF OBJECT_ID(N'[dbo].[subcardlist]', 'U') IS NOT NULL
    DROP TABLE [dbo].[subcardlist];
GO
IF OBJECT_ID(N'[dbo].[tasks]', 'U') IS NOT NULL
    DROP TABLE [dbo].[tasks];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'cardlist'
CREATE TABLE [dbo].[cardlist] (
    [Id] decimal(18,0) IDENTITY(1,1) NOT NULL,
    [name] nvarchar(20)  NOT NULL,
    [color] nchar(15)  NOT NULL,
    [order] tinyint  NOT NULL,
    [created_at] varchar(50)  NOT NULL,
    [projectId] decimal(18,0)  NOT NULL
);
GO

-- Creating table 'cards'
CREATE TABLE [dbo].[cards] (
    [Id] decimal(18,0) IDENTITY(1,1) NOT NULL,
    [name] nvarchar(50)  NOT NULL,
    [description] varchar(max)  NULL,
    [cardListId] decimal(18,0)  NOT NULL,
    [isExpanded] bit  NOT NULL,
    [order] int  NOT NULL,
    [created_at] varchar(50)  NOT NULL
);
GO

-- Creating table 'projects'
CREATE TABLE [dbo].[projects] (
    [Id] decimal(18,0) IDENTITY(1,1) NOT NULL,
    [name] varchar(50)  NOT NULL,
    [created_at] varchar(50)  NOT NULL
);
GO

-- Creating table 'subcardlist'
CREATE TABLE [dbo].[subcardlist] (
    [Id] decimal(18,0) IDENTITY(1,1) NOT NULL,
    [name] nvarchar(20)  NOT NULL,
    [cardlistId] decimal(18,0)  NOT NULL,
    [isExpanded] bit  NOT NULL,
    [order] int  NOT NULL,
    [created_at] nvarchar(50)  NOT NULL
);
GO

-- Creating table 'tasks'
CREATE TABLE [dbo].[tasks] (
    [Id] decimal(18,0) IDENTITY(1,1) NOT NULL,
    [description] varchar(50)  NOT NULL,
    [isCompleted] bit  NOT NULL,
    [cardId] decimal(18,0)  NOT NULL,
    [order] int  NOT NULL,
    [created_at] varchar(50)  NOT NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [Id] in table 'cardlist'
ALTER TABLE [dbo].[cardlist]
ADD CONSTRAINT [PK_cardlist]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'cards'
ALTER TABLE [dbo].[cards]
ADD CONSTRAINT [PK_cards]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'projects'
ALTER TABLE [dbo].[projects]
ADD CONSTRAINT [PK_projects]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'subcardlist'
ALTER TABLE [dbo].[subcardlist]
ADD CONSTRAINT [PK_subcardlist]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'tasks'
ALTER TABLE [dbo].[tasks]
ADD CONSTRAINT [PK_tasks]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- Creating foreign key on [cardListId] in table 'cards'
ALTER TABLE [dbo].[cards]
ADD CONSTRAINT [FK_cardlist]
    FOREIGN KEY ([cardListId])
    REFERENCES [dbo].[cardlist]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_cardlist'
CREATE INDEX [IX_FK_cardlist]
ON [dbo].[cards]
    ([cardListId]);
GO

-- Creating foreign key on [cardlistId] in table 'subcardlist'
ALTER TABLE [dbo].[subcardlist]
ADD CONSTRAINT [FK_cardlistsId]
    FOREIGN KEY ([cardlistId])
    REFERENCES [dbo].[cardlist]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_cardlistsId'
CREATE INDEX [IX_FK_cardlistsId]
ON [dbo].[subcardlist]
    ([cardlistId]);
GO

-- Creating foreign key on [projectId] in table 'cardlist'
ALTER TABLE [dbo].[cardlist]
ADD CONSTRAINT [FK_projectscardlist]
    FOREIGN KEY ([projectId])
    REFERENCES [dbo].[projects]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_projectscardlist'
CREATE INDEX [IX_FK_projectscardlist]
ON [dbo].[cardlist]
    ([projectId]);
GO

-- Creating foreign key on [cardId] in table 'tasks'
ALTER TABLE [dbo].[tasks]
ADD CONSTRAINT [FK_cardsId]
    FOREIGN KEY ([cardId])
    REFERENCES [dbo].[cards]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_cardsId'
CREATE INDEX [IX_FK_cardsId]
ON [dbo].[tasks]
    ([cardId]);
GO

-- Creating foreign key on [cardListId] in table 'cards'
ALTER TABLE [dbo].[cards]
ADD CONSTRAINT [FK_subcardlist]
    FOREIGN KEY ([cardListId])
    REFERENCES [dbo].[subcardlist]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_subcardlist'
CREATE INDEX [IX_FK_subcardlist]
ON [dbo].[cards]
    ([cardListId]);
GO

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------