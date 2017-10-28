import pygame
import math
import sys
import random
from pygame.locals import *



class SquareCrush():
	box_size = 40
	gap_size = 10

	red = (255,0,0)
	green = (0,255,0)
	blue = (0,0, 255)

	def __init__(self,size):
		self.size = size
		self.screen = pygame.display.set_mode((1024,768))
		self.screen.fill((255,255,255))
		self.score = 0
		print ("making board")
		self.board = self.get_randomized_board()
		self.draw_board()
		matches = True
		while matches == True:
			matches = self.check_for_lines()
		pygame.display.update()
		self.moves = 15
		



	def play_game(self):
		mousex = 0
		mousey = 0
		mouse_clicks = set()
		while self.moves > 0:
			mouse_clicked = False
			for event in pygame.event.get():
				if event.type == MOUSEBUTTONUP:
					print("hello I am here")
					print(event.pos)
					mousex, mousey = event.pos
					coords = self.box_at_pixel(mousex,mousey)
					if coords[0] <self.size and coords[1] <self.size:
						mouse_clicks.add(coords)
						mouse_clicked = True
						if len(mouse_clicks) == 2:
							break
			if len(mouse_clicks) == 2:
				first_coords = mouse_clicks.pop()
				second_coords = mouse_clicks.pop()
				if ((first_coords[0]-second_coords[0] in (1,-1) and first_coords[1]==second_coords[1]) or
					(first_coords[1] - second_coords[1] in (1,-1) and first_coords[0] == second_coords[0])):
					self.board[first_coords[0]][first_coords[1]], self.board[second_coords[0]][second_coords[1]] = self.board[second_coords[0]][second_coords[1]], self.board[first_coords[0]][first_coords[1]]
					self.draw_board()
					pygame.display.update()
					matches = True
					while matches == True:
						matches = self.check_for_lines()
					pygame.display.update()
					self.moves -= 1
				mouse_clicks = set()
				print("score is ",self.score)
				print("moves left ", self.moves)




	def box_at_pixel(self,mousex, mousey):
		return math.floor((mousex-50)/50), math.floor((mousey-50)/50)



	def get_randomized_board(self):
		board = []
		for i in range(self.size):
			row = []
			for j in range(self.size):
				row.append(random.choice([self.red, self.green, self.blue]))
			board.append(row)

		return board


	def draw_board(self):
		for x in range(len(self.board)):
			left = x*(self.box_size+self.gap_size)+50
			row = self.board[x]
			for y in range(len(row)):
				top = y*(self.box_size+self.gap_size)+50
				pygame.draw.rect(self.screen, self.board[x][y], (left, top, self.box_size, self.box_size))


	def remove_tiles(self,coords):
		print(coords)
		if coords[1] == 0:
			y = coords[1]
			colour_choice = random.choice([self.blue, self.green, self.red])
			print ("colour was", self.board[coords[0]][y], "colour is now ", colour_choice)
			self.board[coords[0]][y] = colour_choice

		for y in range(coords[1]-1,-1,-1):
			print("x is ", coords[0],"y is ", y)
			self.board[coords[0]][y+1] = self.board[coords[0]][y]
			if y == 0:
				colour_choice = random.choice([self.blue, self.green, self.red])
				print ("colour was", self.board[coords[0]][y], "colour is now ", colour_choice)
				self.board[coords[0]][y] = colour_choice


	def check_for_lines(self):
		for x in range(self.size):
			for y in range(self.size):
				startx = x
				starty = y
				i=1
				colour = self.board[startx][starty]
				line=[(startx,starty)]
				while startx + i < self.size:
					
					if self.board[startx+i][starty] == colour:
						line.append((startx+i,starty))
					else:
						break
					i+=1
				if len(line) >= 3:
					print("found a line of length ", len(line))
					for point in line:
						print ("removing tiles")
						self.remove_tiles(point)
					self.draw_board()
					pygame.display.update()
					return True
				i=1
				line = [(startx,starty)]
				while starty + i < self.size:
					
					if self.board[startx][starty+i] == colour:
						line.append((startx,starty+i))
					else:
						break
					i+=1
				if len(line) >= 3:
					self.score += len(line)
					print("found a line of length ", len(line))
					for point in line:
						print ("removing tiles")
						self.remove_tiles(point)
					self.draw_board()
					pygame.display.update()
					return True
		return False



sc = SquareCrush(8)
sc.play_game()