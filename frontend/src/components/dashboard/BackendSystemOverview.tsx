import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Camera,
  AlertCircle,
  Activity,
  Cpu,
  Eye,
  Shield,
  Users,
} from "lucide-react";

const BackendSystemOverview = () => {
  const aiModels = [
    {
      name: "Fall Detection",
      type: "CNN (TensorFlow)",
      icon: AlertCircle,
      description: "Detects if a person has fallen",
      status: "active",
      path: "models/fall_detection.h5",
    },
    {
      name: "Safety Equipment Detection",
      type: "YOLO (PyTorch)",
      icon: Shield,
      description: "Detects helmet and safety vest compliance",
      status: "active",
      path: "models/safety_detection.pt",
    },
    {
      name: "Face Recognition",
      type: "Deep Learning",
      icon: Users,
      description: "Identifies authorized personnel",
      status: "active",
      path: "models/face_recognition/",
    },
    {
      name: "Pose Estimation",
      type: "Neural Network",
      icon: Activity,
      description: "Monitors worker posture and movement",
      status: "active",
      path: "models/pose_estimation/",
    },
  ];

  const systemComponents = [
    {
      name: "Camera Manager",
      icon: Camera,
      description:
        "Handles multiple camera sources and streams frames for inference",
      features: [
        "USB & IP camera support",
        "Multi-stream processing",
        "Frame buffering",
      ],
    },
    {
      name: "Inference Manager",
      icon: Brain,
      description: "Loads and runs all AI models with real-time processing",
      features: [
        "Multi-threaded inference",
        "Model output merging",
        "GPU acceleration",
      ],
    },
    {
      name: "Alert System",
      icon: AlertCircle,
      description: "Applies safety logic and triggers notifications",
      features: [
        "Fall detection alerts",
        "PPE violation warnings",
        "Unauthorized access alerts",
      ],
    },
    {
      name: "Hardware Accelerator",
      icon: Cpu,
      description: "MemryX Engine integration for optimized performance",
      features: [
        "Hardware acceleration",
        "Model optimization",
        "Low-latency inference",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Eye className="w-6 h-6 text-primary" />
          AI Vision System Architecture
        </h2>
        <p className="text-muted-foreground">
          Real-time safety monitoring powered by multiple deep learning models
        </p>
      </div>

      {/* AI Models */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Active AI Models
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiModels.map((model) => {
            const Icon = model.icon;
            return (
              <Card
                key={model.name}
                className="bg-gradient-card border-border hover:border-primary/50 transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {model.name}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          {model.type}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-success/20 text-success-foreground border-success/30">
                      {model.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {model.description}
                  </p>
                  <code className="text-xs text-primary/80 bg-primary/5 px-2 py-1 rounded">
                    {model.path}
                  </code>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* System Components */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">
          System Components
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {systemComponents.map((component) => {
            const Icon = component.icon;
            return (
              <Card
                key={component.name}
                className="bg-gradient-card border-border"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">
                      {component.name}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {component.description}
                  </p>
                  <div className="space-y-1">
                    {component.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Technology Stack */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Technology Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">Backend</p>
              <div className="space-y-1">
                <Badge variant="outline" className="text-xs">
                  Python
                </Badge>
                <Badge variant="outline" className="text-xs">
                  FastAPI
                </Badge>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">Vision</p>
              <div className="space-y-1">
                <Badge variant="outline" className="text-xs">
                  OpenCV
                </Badge>
                <Badge variant="outline" className="text-xs">
                  NumPy
                </Badge>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                ML Frameworks
              </p>
              <div className="space-y-1">
                <Badge variant="outline" className="text-xs">
                  TensorFlow
                </Badge>
                <Badge variant="outline" className="text-xs">
                  PyTorch
                </Badge>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                Acceleration
              </p>
              <div className="space-y-1">
                <Badge variant="outline" className="text-xs">
                  MemryX
                </Badge>
                <Badge variant="outline" className="text-xs">
                  GPU
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackendSystemOverview;
