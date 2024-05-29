# Turbofan on V8 

Turbofan compiler is an advanced optimizing compiler used by the V8 Javascript engine. It has some functionalities:
- Optimization
- Just-In-Time compilation: Turbofan compiles JavaScript code into machine code at runtime, rewther than ahead of time. This allows it to optimize code based on actual usage patterns

## Table of Content


## Sea of Nodes

TurboFan works on a program representation called `sea of nodes`. There are 3 types of edges:
- Control Edges: will be stored in Control Flow Graphs
- Value Edges: will be stored in Data Flow Graphs
- Effect edges: 


**NumberAdd**

```js
// d8 --trace-turbo --allow-natives-syntax number_add.js
function opt_me() {
    let x = Math.random();
    let y = x + 2;
    return y + 3;
}

opt_me();
%OptimizeFunctionOnNextCall(opt_me);
opt_me();

```

Graph comes through `OptimizeGraph`

```cpp

bool PipelineImpl::OptimizeGraph(Linkage* linkage) {
  PipelineData* data = this->data_;

  data->BeginPhaseKind("V8.TFLowering");

  if (V8_LIKELY(!v8_flags.turboshaft_from_maglev)) {
    // Trim the graph before typing to ensure all nodes are typed.
    Run<EarlyGraphTrimmingPhase>();
    RunPrintAndVerify(EarlyGraphTrimmingPhase::phase_name(), true); //<================== Graph builder phase

    // Type the graph and keep the Typer running such that new nodes get
    // automatically typed when they are created. 
    Run<TyperPhase>(data->CreateTyper());               // <=========================== Typer Phase
    RunPrintAndVerify(TyperPhase::phase_name());

    Run<TypedLoweringPhase>();                          // <========================= Typed Lowering Phase
    RunPrintAndVerify(TypedLoweringPhase::phase_name());

    if (data->info()->loop_peeling()) {
      Run<LoopPeelingPhase>();
      RunPrintAndVerify(LoopPeelingPhase::phase_name(), true);
    } else {
      Run<LoopExitEliminationPhase>();
      RunPrintAndVerify(LoopExitEliminationPhase::phase_name(), true);
    }

    if (v8_flags.turbo_load_elimination) {
      Run<LoadEliminationPhase>();                      // <========================== Load Elimination Phase
      RunPrintAndVerify(LoadEliminationPhase::phase_name());
    }
    data->DeleteTyper();

    if (v8_flags.turbo_escape) {
      Run<EscapeAnalysisPhase>();
      RunPrintAndVerify(EscapeAnalysisPhase::phase_name());
    }

    if (v8_flags.assert_types) {
      Run<TypeAssertionsPhase>();
      RunPrintAndVerify(TypeAssertionsPhase::phase_name());
    }

//... And many optimizing steps above 

```

Graph Builder Phase

![numberAdd](numberAdd.png)

Typer Phase

![typer](typer.png)


Typed Lowering Phase

```cpp
// v8/src/compiler/pipeline.cc
struct TypedLoweringPhase {
  DECL_PIPELINE_PHASE_CONSTANTS(TypedLowering)

  void Run(TFPipelineData* data, Zone* temp_zone) {
    GraphReducer graph_reducer(
        temp_zone, data->graph(), &data->info()->tick_counter(), data->broker(),
        data->jsgraph()->Dead(), data->observe_node_manager());
    DeadCodeElimination dead_code_elimination(&graph_reducer, data->graph(),
                                              data->common(), temp_zone);
    JSCreateLowering create_lowering(&graph_reducer, data->jsgraph(),
                                     data->broker(), temp_zone);
    JSTypedLowering typed_lowering(&graph_reducer, data->jsgraph(),
                                   data->broker(), temp_zone);
    ConstantFoldingReducer constant_folding_reducer(
        &graph_reducer, data->jsgraph(), data->broker());
    TypedOptimization typed_optimization(&graph_reducer, data->dependencies(),
                                         data->jsgraph(), data->broker());
    SimplifiedOperatorReducer simple_reducer(
        &graph_reducer, data->jsgraph(), data->broker(), BranchSemantics::kJS);
    CheckpointElimination checkpoint_elimination(&graph_reducer);
    CommonOperatorReducer common_reducer(
        &graph_reducer, data->graph(), data->broker(), data->common(),
        data->machine(), temp_zone, BranchSemantics::kJS);
    AddReducer(data, &graph_reducer, &dead_code_elimination);

    AddReducer(data, &graph_reducer, &create_lowering);
    AddReducer(data, &graph_reducer, &constant_folding_reducer);
    AddReducer(data, &graph_reducer, &typed_lowering);
    AddReducer(data, &graph_reducer, &typed_optimization);
    AddReducer(data, &graph_reducer, &simple_reducer);
    AddReducer(data, &graph_reducer, &checkpoint_elimination);
    AddReducer(data, &graph_reducer, &common_reducer);

    // ConstantFoldingReducer, JSCreateLowering, JSTypedLowering, and
    // TypedOptimization access the heap.
    UnparkedScopeIfNeeded scope(data->broker());

    graph_reducer.ReduceGraph();
  }
};


```

![TypedLowering](TypedLowering.png)