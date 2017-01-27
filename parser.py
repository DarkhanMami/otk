#! /usr/bin/env python
# -*- coding: utf-8 -*-

import poplib
import string, random
import StringIO, rfc822
import os
import email
import xlrd
from collections import OrderedDict
import simplejson as json
from sets import Set
from datetime import datetime



SERVER = "pop.gmail.com"
USER  = "darkhan.mami@gmail.com"
PASSWORD = "!WANrltw92"
DIR = "/home/darkhan/OTK/"


def getAttachment(emails):
    for mail in emails:
        for part in mail.walk():
            print(part.get_content_type())

            if part.get_content_maintype() == 'multipart':
                continue

            if part.get('Content-Disposition') is None:
                print("no content dispo")
                continue

            filename = part.get_filename()
            if not(filename): filename = "Pulse.xlsx"
            print(filename)

            fp = open(os.path.join(DIR, filename), 'wb')
            fp.write(part.get_payload(decode=1))
            fp.close()



def fileParse():
    wb = xlrd.open_workbook(DIR + 'TS.xls')
    sh = wb.sheet_by_index(0)

    fullData = dict()
    smartData = dict()
    places = []
    colNames = ['Тип ТС','Месяц','Год','Доходы','Доля в доходах','Расходы','Прямые расходы','Косвенные расходы','Маржа','Доля в расходах']
    plSet = Set([])


    col_dict = OrderedDict()
    col_dict['colNames'] = colNames

    j = json.dumps(col_dict)
    with open('colNames.json', 'w') as f:
        f.write(j)

    monthes = []
    for rownum in range(1, sh.nrows):
        row_values = sh.row_values(rownum)
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


        fullData[row_values[1]].append(temp)


        smartData[row_values[1] + row_values[0]] = temp
        if row_values[0] not in plSet:
            plSet.add(row_values[0])
            places.append(row_values[0])




    pl_dict = OrderedDict()
    pl_dict['places'] = places
    j = json.dumps(pl_dict)
    with open('places.json', 'w') as f:
        f.write(j)




    full_dict = OrderedDict()
    full_dict['fullData'] = fullData
    j = json.dumps(full_dict)

    with open('fullData2.json', 'w') as f:
        f.write(json.dumps(fullData))
    with open('places2.json', 'w') as f:
        f.write(json.dumps(places))
    with open('colNames2.json', 'w') as f:
        f.write(json.dumps(colNames))
    with open('monthes2.json', 'w') as f:
        f.write(json.dumps(monthes))

    with open('smartData2.json', 'w') as f:
        f.write(json.dumps(smartData))

    with open('fullData.json', 'w') as f:
        f.write(j)

    with open('fullData.json', 'w') as f:
        f.write(j)







# server = poplib.POP3_SSL(SERVER)

# server.user(USER)
# server.pass_(PASSWORD)


# resp, items, octets = server.list()


# numMessages = len(items)

# for i in xrange(numMessages - 1, 0 , -1):
#     id, size = string.split(items[i])
#     resp, text, octets = server.retr(id)
#     raw_message = text

#     text = string.join(text, "\n")
#     file = StringIO.StringIO(text)
#     message = rfc822.Message(file)

#     if message['Subject'] == 'Pulse':
#         emails = [email.message_from_string('\n'.join(raw_message))]
#         getAttachment(emails)
#         break

fileParse()

print 'DONE'
