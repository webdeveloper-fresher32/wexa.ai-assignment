import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function GraphViewer({ graphData, onNodeClick }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!graphData || !graphData.nodes || !graphData.links) return;

    const width = 800;
    const height = 600;

    // Clear previous SVG contents
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Deep copy data because d3 modifies it
    const nodes = graphData.nodes.map(d => ({ ...d, id: d.name }));
    const links = graphData.links.map(d => ({ ...d }));

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1));

    // Define arrow markers for directed links
    svg.append("defs").selectAll("marker")
      .data(["end"])
      .enter().append("marker")
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#64748b")
      .attr("d", "M0,-5L10,0L0,5");

    const link = svg.append("g")
      .attr("stroke", "#64748b")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#end)");

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        if (onNodeClick) onNodeClick(d.id);
      })
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Determine color based on difficulty
    const getColor = (difficulty) => {
      switch (difficulty?.toLowerCase()) {
        case 'beginner': return '#10b981'; // green
        case 'intermediate': return '#f59e0b'; // yellow
        case 'advanced': return '#ef4444'; // red
        case 'expert': return '#8b5cf6'; // purple
        default: return '#3b82f6'; // blue
      }
    };

    node.append("circle")
      .attr("r", 15)
      .attr("fill", d => getColor(d.difficulty))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    node.append("text")
      .text(d => d.name)
      .attr("x", 20)
      .attr("y", 5)
      .attr("font-family", "system-ui, sans-serif")
      .attr("font-size", "12px")
      .attr("fill", "#e2e8f0");

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [graphData, onNodeClick]);

  return (
    <div className="w-full h-full overflow-hidden rounded-xl border border-slate-700 bg-slate-800/50 flex items-center justify-center min-h-[600px]">
      <svg 
        ref={svgRef} 
        width="100%" 
        height="100%" 
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
}
