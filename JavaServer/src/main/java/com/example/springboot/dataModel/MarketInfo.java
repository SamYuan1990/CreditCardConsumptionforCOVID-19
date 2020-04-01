package com.example.springboot.dataModel;

public class MarketInfo implements Comparable<MarketInfo> {
    public String Branch;
    public String City;

    public boolean equals(MarketInfo i){
        return this.City.equals(i.City) & this.Branch.equals(i.Branch);
    }

    @Override
    public int compareTo(MarketInfo i) {
        if(this.equals(i)){
            return 0;
        }
        return 1;
    }

    @Override
    public String toString(){
        return this.Branch+":"+this.City;
    }
}
