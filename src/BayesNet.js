class BayesNet{

	constructor(v, x, y, e){
		this.V = v
    this.graph = new Map();
    this.directedGraph = new Map();
    this.paths = [];
    this.dseparate = [];
    this.x = x;
    this.y = y;
    this.e = e;
    this.rules = [];
    this.nodes = [];
	}

	addEdge(u, v){
    if(!this.graph.has(u)){
      this.graph.set(u,[]);
    }
    if(!this.graph.has(v)){
      this.graph.set(v,[]);
    }
		this.graph.get(u).push(v);
    this.graph.get(v).push(u);
    if(!this.directedGraph.has(u)){
      this.directedGraph.set(u,[]);
    }
		this.directedGraph.get(u).push(v);
	}

	getPathsUtil(u, d, visited, path){
      visited.set(u, true);
    
    path.push(u);
    //console.log(u+" "+d);
    
		if(u===d){
      
      this.paths.push(path.slice());
      //console.log(this.paths);
		}
		else{
			for(var i = 0; i < this.graph.get(u).length;i++){
				if(visited.get(this.graph.get(u)[i]) === false){
          //console.log("inside if");
          //console.log(this.graph.get(u));
          this.getPathsUtil(this.graph.get(u)[i],d,visited,path);
          
				}
			}
    }
    
    path.pop();
		visited.set(u, false);

	}

	getPaths(s, d){
    //console.log(s+" "+d);
    var visited = new Map();
    for(var i = 0; i < Array.from(this.graph.keys()).length; i++){
      visited.set(Array.from(this.graph.keys())[i], false);
    }
    var path = [];
  
    this.getPathsUtil(s, d,visited, path) 
  }

	checkDSeparation(){
		for(var i = 0; i < this.x.length; i++){
			for(var j = 0; j < this.y.length; j++){
				this.getPaths(this.x[i],this.y[j]);
			}
		}

    this.dseparate = new Array(this.paths.length);	
    this.rules = new Array(this.paths.length);
    this.nodes = new Array(this.paths.length);
        for(var i = 0; i < this.paths.length;i++)	{
          this.rules[i] = new Array();
          this.nodes[i] = new Array();
        }
    //console.log("paths are");
    //console.log(this.paths);
		for(var i = 0; i < this.paths.length; i++){
			this.isPathDSeparated(this.paths[i]);
		}
    }

    isPathDSeparated(path){
    	for(var i = 1; i < path.length-1;i++){
    		if(this.e.includes(path[i]) && this.checkRuleOne(i, path)){
          this.dseparate[this.paths.indexOf(path)] = true;
          
          
          this.rules[this.paths.indexOf(path)].push(1);
          
          this.nodes[this.paths.indexOf(path)].push(i);
    		}
    		if(this.e.includes(path[i]) && this.checkRuleTwo(i, path)){
          //console.log("rule is");
          
    			this.dseparate[this.paths.indexOf(path)] = true;
    			
          this.rules[this.paths.indexOf(path)].push(2);
          
          //console.log(this.rules);
          this.nodes[this.paths.indexOf(path)].push(i);
    		}
    		if(this.checkRuleThree(i, path)){
    			this.dseparate[this.paths.indexOf(path)] = true;
          this.rules[this.paths.indexOf(path)].push(3);
          
          this.nodes[this.paths.indexOf(path)].push(i);
    		}
    	}
	}

	checkRuleOne(index, path){
    //.log(index);
    //console.log(path);
    //console.log(this.directedGraph.get(path[index+1]));
		return this.directedGraph.get(path[index]).includes(path[index-1]) && 
				this.directedGraph.get(path[index]).includes(path[index+1]);
	}

	checkRuleTwo(index, path){
		return this.directedGraph.get(path[index-1]).includes(path[index]) && 
				this.directedGraph.get(path[index]).includes(path[index+1]);
	}

	checkRuleThree(index, path){
    var visited = new Map();
    for(var i = 0; i < Array.from(this.graph.keys()).length; i++){
      visited.set(Array.from(this.graph.keys())[i], false);
    }
    return this.dfs(path[index], visited) && 
    (this.directedGraph.get(path[index]).includes(path[index-1]) && 
    this.directedGraph.get(path[index]).includes(path[index+1]));
	}

	dfs(v, visited){
        visited.set(v, true);
        if (this.e.includes(v)) {return false;}

        for(var i = 0; this.V.length; i++){
        	if(visited.get(i)===false){
        		this.dfs(i,visited);
        	}
        }
        return true;       
    }
}


export function findDSeparatedPaths(nodes, edges){
	var x = [];
	var y = [];
	var e = [];
	for(var i = 0; i < nodes.length; i++){
		if(nodes[i].set === 1){
			x.push(nodes[i].key);
		}
		if(nodes[i].set === 2){
			y.push(nodes[i].key);
		}
		if(nodes[i].set === 3){
			e.push(nodes[i].key);
    }
    
  }
  //console.log(x);
  //console.log(y);

  var g = new BayesNet(nodes.length, x, y, e);
  for(var i = 0; i < nodes.length; i++){
    g.directedGraph.set(nodes[i].key,[]);
    g.graph.set(nodes[i].key,[]);
  }
  
  //console.log(g.x);
  //console.log(g.y);
  //console.log(e);

	for(var i = 0; i < edges.length; i++){
		g.addEdge(edges[i].from, edges[i].to);
	}
  //console.log(g);
  //g.getPaths(0,2);

  g.checkDSeparation();
  //console.log("D-Separated function call obj: ");
  //console.log(g);

	return g;
}