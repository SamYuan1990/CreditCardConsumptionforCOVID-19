package com.example.springboot.util;

import java.util.ArrayList;

public class statusRepot {

    public String name;
    public ArrayList<statusRepot> children;

    public void addChild(statusRepot s){
        if(this.children==null){
            this.children=new  ArrayList<statusRepot>();
        }
        this.children.add(s);
    }
}
