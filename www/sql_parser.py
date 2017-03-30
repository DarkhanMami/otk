# -*- coding: utf-8 -*-

import pymssql  
import poplib
import string, random
import StringIO, rfc822
import os
import xlrd
from collections import OrderedDict
import simplejson as json
from sets import Set
from datetime import datetime

main_fullData = dict()
main_places = dict()
main_colNames = dict()
main_monthes = dict()
main_smartData = dict()
conn = pymssql.connect(server='192.168.33.87', user='sa', password='Qwer1234', database='OTK_upload')
cursor = conn.cursor() 


def fileParse(cursor, index):
	fullData = dict()
	smartData = dict()
	places = []
	colNames = ['Тип услуги','Месяц','Год','Доходы','Доля в доходах','Расходы','Прямые расходы','Косвенные расходы','Маржа','Доля в расходах']
	plSet = Set([])
	monthes = []
	row = cursor.fetchone()
	ii = 1;
	while row:
		row_values = row
		ii += 1
		temp = []
		
		temp.append(row_values[0])
		temp.append(row_values[1])
		if row_values[1] not in monthes:
			monthes.append(row_values[1])
			fullData[row_values[1]] = list()

		try:
			float(row_values[2])
			temp.append(float(row_values[2]))
		except:
			temp.append(row_values[2])
		try:
			float(row_values[3])
			temp.append(float("{0:.2f}".format(row_values[3])))
		except:
			temp.append(row_values[3])
		try:
			float(row_values[4])
			temp.append(float("{0:.2f}".format(row_values[4])))
		except:
			temp.append(row_values[4])
		try:
			float(row_values[5])
			temp.append(float("{0:.2f}".format(row_values[5])))
		except:
			temp.append(row_values[5])
		try:
			float(row_values[6])
			temp.append(float("{0:.2f}".format(row_values[6])))
		except:
			temp.append(row_values[6])
		try:
			float(row_values[7])
			temp.append(float("{0:.2f}".format(row_values[7])))
		except:
			temp.append(row_values[7])
		try:
			float(row_values[8])
			temp.append(float("{0:.2f}".format(row_values[8])))
		except:
			temp.append(row_values[8])
		try:
			float(row_values[9])
			temp.append(float("{0:.2f}".format(row_values[9])))
		except:
			temp.append(row_values[9])
		try:
			float(row_values[10])
			temp.append(float("{0:.2f}".format(row_values[10])))
		except:
			temp.append(row_values[10])

		temp.append(row_values[11])

		fullData[row_values[1]].append(temp)


		smartData[row_values[1] + row_values[0]] = temp
		if row_values[0] not in plSet:
			plSet.add(row_values[0])
			places.append(row_values[0])

		row = cursor.fetchone()

	main_fullData[index] = fullData
	main_places[index] = places
	main_colNames[index] = colNames
	main_monthes[index] = monthes
	main_smartData[index] = smartData









cursor.execute("SELECT * FROM [dbo].[Planshet_Type_TS] WHERE utt = 'Общее';")
fileParse(cursor,'otk')

cursor.execute("SELECT * FROM [dbo].[Planshet_Type_TS] WHERE utt = 'БУТТ' and kolonna = 'Общее';")
fileParse(cursor,'data_butt')

cursor.execute("SELECT * FROM [dbo].[Planshet_Type_TS] WHERE utt = 'БУТТ' and kolonna = 'БУТТ 1';")
fileParse(cursor,'data_butt_1')

cursor.execute("SELECT * FROM [dbo].[Planshet_Type_TS] WHERE utt = 'БУТТ' and kolonna = 'БУТТ 2';")
fileParse(cursor,'data_butt_2')

cursor.execute("SELECT * FROM [dbo].[Planshet_Type_TS] WHERE utt = 'БУТТ' and kolonna = 'БУТТ 3';")
fileParse(cursor,'data_butt_3')

cursor.execute("SELECT * FROM [dbo].[Planshet_Type_TS] WHERE utt = 'БУТТ' and kolonna = 'БУТТ 4';")
fileParse(cursor,'data_butt_4')

cursor.execute("SELECT * FROM [dbo].[Planshet_Type_TS] WHERE utt = 'БУТТ' and kolonna = 'БУТТ 5';")
fileParse(cursor,'data_butt_5')

cursor.execute("SELECT * FROM [dbo].[Planshet_Type_TS] WHERE utt = 'ЖУТТ' and kolonna = 'Общее';")
fileParse(cursor,'data_jutt')

cursor.execute("SELECT * FROM [dbo].[Planshet_Type_TS] WHERE utt = 'ЖУТТ' and kolonna = 'ЖУТТ 1';")
fileParse(cursor,'data_jutt_1')

cursor.execute("SELECT * FROM [dbo].[Planshet_Type_TS] WHERE utt = 'ЖУТТ' and kolonna = 'ЖУТТ 2';")
fileParse(cursor,'data_jutt_2')

cursor.execute("SELECT * FROM [dbo].[Planshet_Type_TS] WHERE utt = 'ЖУТТ' and kolonna = 'ЖУТТ 3';")
fileParse(cursor,'data_jutt_3')

cursor.execute("SELECT * FROM [dbo].[Planshet_Type_TS] WHERE utt = 'ЖУТТ' and kolonna = 'ЖУТТ 4';")
fileParse(cursor,'data_jutt_4')

cursor.execute("SELECT * FROM [dbo].[Planshet_Type_TS] WHERE utt = 'МУТТ' and kolonna = 'Общее';")
fileParse(cursor,'data_mutt')

cursor.execute("SELECT * FROM [dbo].[Planshet_Type_TS] WHERE utt = 'МУТТ' and kolonna = 'МУТТ 1';")
fileParse(cursor,'data_mutt_1')

cursor.execute("SELECT * FROM [dbo].[Planshet_Type_TS] WHERE utt = 'МУТТ' and kolonna = 'МУТТ 2';")
fileParse(cursor,'data_mutt_2')

cursor.execute("SELECT * FROM [dbo].[Planshet_Type_TS] WHERE utt = 'МУТТ' and kolonna = 'МУТТ 3';")
fileParse(cursor,'data_mutt_3')



with open('fullData2.json', 'w') as f:
    f.write(json.dumps(main_fullData))
with open('places2.json', 'w') as f:
    f.write(json.dumps(main_places))
with open('colNames2.json', 'w') as f:
    f.write(json.dumps(main_colNames))
with open('monthes2.json', 'w') as f:
    f.write(json.dumps(main_monthes))
with open('smartData2.json', 'w') as f:
    f.write(json.dumps(main_smartData))




print 'DONE'