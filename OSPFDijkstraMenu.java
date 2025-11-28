import java.util.*;

class Node implements Comparable<Node> {
    int vertex;
    int distance;

    Node(int vertex, int distance) {
        this.vertex = vertex;
        this.distance = distance;
    }

    @Override
    public int compareTo(Node other) {
        return Integer.compare(this.distance, other.distance);
    }
}

public class OSPFDijkstraMenu {

    public static void dijkstra(int[][] graph, int source) {
        int V = graph.length;
        int[] dist = new int[V];
        int[] parent = new int[V];
        boolean[] visited = new boolean[V];

        Arrays.fill(dist, Integer.MAX_VALUE);
        Arrays.fill(parent, -1);
        dist[source] = 0;

        PriorityQueue<Node> pq = new PriorityQueue<>();
        pq.add(new Node(source, 0));

        while (!pq.isEmpty()) {
            int u = pq.poll().vertex;

            if (visited[u])
                continue;
            visited[u] = true;

            for (int v = 0; v < V; v++) {
                if (graph[u][v] != 0 && !visited[v]) {
                    int newDist = dist[u] + graph[u][v];
                    if (newDist < dist[v]) {
                        dist[v] = newDist;
                        parent[v] = u;
                        pq.add(new Node(v, dist[v]));
                    }
                }
            }
        }

        printResult(dist, parent, source);
    }

    public static void printResult(int[] dist, int[] parent, int source) {
        System.out.println("\nRouter\tDistance\tPath");
        for (int i = 0; i < dist.length; i++) {
            if (i != source) {
                System.out.print(source + " -> " + i + "\t" + dist[i] + "\t\t");
                printPath(parent, i);
                System.out.println();
            }
        }
    }

    public static void printPath(int[] parent, int j) {
        if (j == -1)
            return;
        printPath(parent, parent[j]);
        System.out.print(j + " ");
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter number of routers: ");
        int n = sc.nextInt();
        int[][] graph = new int[n][n];

        System.out.print("Enter number of edges: ");
        int edges = sc.nextInt();

        System.out.println("Enter edges in format: <source> <destination> <cost>");
        for (int i = 0; i < edges; i++) {
            int u = sc.nextInt();
            int v = sc.nextInt();
            int cost = sc.nextInt();
            graph[u][v] = cost;
            graph[v][u] = cost; 
        }

        while (true) {
            System.out.println("\n--- MENU ---");
            System.out.println("1. Find shortest path from a source router");
            System.out.println("2. Exit");
            System.out.print("Enter choice: ");
            int choice = sc.nextInt();

            switch (choice) {
                case 1:
                    System.out.print("Enter source router: ");
                    int source = sc.nextInt();
                    if (source < 0 || source >= n) {
                        System.out.println("Invalid source router!");
                    } else {
                        dijkstra(graph, source);
                    }
                    break;
                case 2:
                    System.out.println("Exiting...");
                    sc.close();
                    return;
                default:
                    System.out.println("Invalid choice!");
            }
        }
    }
}
